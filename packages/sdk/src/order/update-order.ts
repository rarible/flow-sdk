import type { Fcl } from "@rarible/fcl-types"
import type { Maybe } from "@rarible/types/build/maybe"
import type { BigNumber, FlowContractAddress } from "@rarible/types"
import { toBigNumber, toFlowAddress } from "@rarible/types"
import type { FlowNftItemControllerApi, FlowOrder, FlowOrderControllerApi } from "@rarible/flow-api-client"
import type { AuthWithPrivateKey, FlowCurrency, FlowNetwork, FlowTransaction } from "../types"
import { runTransaction, waitForSeal } from "../common/transaction"
import { getOrderCode } from "../tx-code-store/order"
import { fixAmount } from "../common/fix-amount"
import { getCollectionConfig } from "../common/collection/get-config"
import { checkPrice } from "../common/check-price"
import { extractTokenId, toFlowItemId } from "../common/item"
import { getProtocolFee } from "../tx-code-store/get-protocol-fee"
import { getBidCode } from "../tx-code-store/order/bid"
import { calculateFees } from "../common/calculate-fees"
import { getPreparedOrder } from "./common/get-prepared-order"

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
): Promise<FlowTransaction> {
	const { collection, currency, sellItemPrice, order } = request
	checkPrice(sellItemPrice)
	if (fcl) {
		const from = auth ? toFlowAddress((await auth()).addr) : toFlowAddress((await fcl.currentUser().snapshot()).addr!)
		if (!from) {
			throw new Error("FLOW-SDK: Can't get current user address")
		}
		const preparedOrder = await getPreparedOrder(orderApi, order)
		const { name, map } = getCollectionConfig(network, collection)
		switch (preparedOrder.type) {
			case "LIST": {
				const { royalties } = network === "emulator" ?
					{ royalties: [] } : await itemApi.getNftItemById({ itemId: preparedOrder.itemId })
				const txId = await runTransaction(
					fcl,
					map,
					getOrderCode(fcl, name).update(
						currency,
						preparedOrder.id,
						fixAmount(sellItemPrice),
						extractTokenId(toFlowItemId(preparedOrder.itemId)),
						preparedOrder.data.originalFees || [],
						royalties || [],
						preparedOrder.data.payouts || [{ account: from, value: toBigNumber("1.0") }],
					),
					auth,
				)
				return await waitForSeal(fcl, txId)
			}
			case "BID": {
				const protocolFees = await getProtocolFee(fcl, network)
				const txId = await runTransaction(
					fcl,
					map,
					getBidCode(fcl, name).update(currency, preparedOrder.id, sellItemPrice,
						[
							...calculateFees(sellItemPrice, [protocolFees.buyerFee]),
							...calculateFees(sellItemPrice, preparedOrder.data.originalFees || []),
						]),
					auth,
				)
				return await waitForSeal(fcl, txId)
			}
			default:
				throw new Error(`Unsupported order type: ${preparedOrder.type}`)
		}
	}
	throw new Error("Fcl is required for updating order")
}
