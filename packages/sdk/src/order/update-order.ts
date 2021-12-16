import type { Fcl } from "@rarible/fcl-types"
import type { Maybe } from "@rarible/types/build/maybe"
import type { BigNumber } from "@rarible/types"
import { toFlowAddress } from "@rarible/types"
import type { FlowNftItemControllerApi, FlowOrder, FlowOrderControllerApi } from "@rarible/flow-api-client"
import type { AuthWithPrivateKey, FlowCurrency, FlowNetwork } from "../types"
import { runTransaction, waitForSeal } from "../common/transaction"
import { getCollectionConfig } from "../common/collection/get-config"
import { checkPrice } from "../common/check-price"
import { parseEvents } from "../common/parse-tx-events"
import type { FlowContractAddress } from "../common/flow-address"
import { getOrderCode } from "../tx-code-store/order/storefront"
import { getOrderCodeLegacy } from "../tx-code-store/order/order-legacy"
import { fixAmount } from "../common/fix-amount"
import { getPreparedOrder } from "./common/get-prepared-order"
import type { FlowSellResponse } from "./sell"
import { getProtocolFee } from "./get-protocol-fee"
import { calculateSaleCuts } from "./common/calculate-sale-cuts"

export type FlowUpdateOrderRequest = {
	collection: FlowContractAddress,
	currency: FlowCurrency,
	order: number | FlowOrder,
	sellItemPrice: BigNumber,
}

export async function updateOrder(
	fcl: Maybe<Fcl>,
	itemApi: FlowNftItemControllerApi,
	orderApi: FlowOrderControllerApi,
	auth: AuthWithPrivateKey,
	network: FlowNetwork,
	request: FlowUpdateOrderRequest,
): Promise<FlowSellResponse> {
	const { collection, currency, sellItemPrice, order } = request
	checkPrice(sellItemPrice)
	if (fcl) {
		const from = auth ? toFlowAddress((await auth()).addr) : toFlowAddress((await fcl.currentUser().snapshot()).addr!)
		if (!from) {
			throw new Error("FLOW-SDK: Can't get current user address")
		}
		const preparedOrder = await getPreparedOrder(orderApi, order)
		const { name, map } = getCollectionConfig(network, collection)

		const { royalties } = network === "emulator" ?
			{ royalties: [] } : await itemApi.getNftItemById({ itemId: preparedOrder.itemId })
		switch (preparedOrder.make["@type"]) {
			case "nft": {
				const txId = await runTransaction(
					fcl,
					map,
					getOrderCodeLegacy(name).update(fcl, currency, preparedOrder.id, fixAmount(sellItemPrice)),
					auth,
				)
				const tx = await waitForSeal(fcl, txId)
				const simpleOrderId = parseEvents<string>(tx.events, "ListingAvailable", "listingResourceID")
				return {
					...tx,
					orderId: parseInt(simpleOrderId),
				}
			}
			case "fungible": {
				const txId = await runTransaction(
					fcl,
					map,
					getOrderCode(fcl, name).update(
						currency,
						preparedOrder.id,
						calculateSaleCuts(
							from,
							fixAmount(sellItemPrice), [
								...(preparedOrder.data.payouts || []),
								getProtocolFee.percents(network).sellerFee,
								...(preparedOrder.data.originalFees || []),
								...(royalties || []),
							]),
					),
					auth,
				)
				const tx = await waitForSeal(fcl, txId)
				const simpleOrderId = parseEvents<string>(tx.events, "ListingAvailable", "listingResourceID")
				return {
					...tx,
					orderId: parseInt(simpleOrderId),
				}
			}
			default:
				throw new Error(`Unknown token type: ${preparedOrder.make["@type"]}`)
		}
	}
	throw new Error("Fcl is required for updating order")
}
