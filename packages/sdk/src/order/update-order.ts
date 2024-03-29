import type { Fcl } from "@rarible/fcl-types"
import type { FlowContractAddress, Maybe } from "@rarible/types"
import type { BigNumberLike } from "@rarible/types"
import { toBn } from "@rarible/utils"
import { toFlowAddress } from "@rarible/types"
import type { FlowOrder, FlowOrderControllerApi } from "@rarible/flow-api-client"
import type { AuthWithPrivateKey, FlowCurrency, FlowNetwork } from "../types"
import { runTransaction, waitForSeal } from "../common/transaction"
import { getCollectionConfig } from "../common/collection/get-config"
import { checkPrice } from "../common/check-price"
import { parseEvents } from "../common/parse-tx-events"
import { getOrderCode } from "../tx-code-store/order/storefront"
import {getWhitelabelOrderCode, isWhitelabelCollection} from "../tx-code-store/order/whitelabel-storefront"
import { fixAmount } from "../common/fix-amount"
import {
	getOrderDetailsFromBlockchain,
	getStorefrontV2OrderDetailsFromBlockchain,
} from "./common/get-order-details-from-blockchain"
import { getPreparedOrder } from "./common/get-prepared-order"
import type { FlowSellResponse } from "./sell"
import { calculateUpdateOrderSaleCuts } from "./common/calculate-update-order-sale-cuts"
import {getOrderId} from "./common/get-order-id"

export type FlowUpdateOrderRequest = {
	collection: FlowContractAddress,
	currency: FlowCurrency,
	order: string | number | FlowOrder,
	sellItemPrice: BigNumberLike,
}

export async function updateOrder(
	fcl: Maybe<Fcl>,
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
		const orderId = getOrderId(request.order)
		const preparedOrder = await getPreparedOrder(orderApi, order)
		const { name, map } = getCollectionConfig(network, collection)

		if (isWhitelabelCollection(name)) {
			const details = await getStorefrontV2OrderDetailsFromBlockchain(fcl, network, from, orderId)
			if (details.purchased) {
				throw new Error("Item was purchased")
			}

			const [fee] = preparedOrder.data.originalFees
			let comissionAmount = toBn(fee?.value || 0)
				.div(10000)
				.multipliedBy(request.sellItemPrice)
				.decimalPlaces(8)
			if (comissionAmount.gte(request.sellItemPrice)) {
				comissionAmount = toBn(0)
			}

			const txId = await runTransaction(
				fcl,
				map,
				getWhitelabelOrderCode(fcl, name).update({
					collectionName: name,
					orderId,
					itemId: parseInt(details.nftID),
					saleItemPrice: fixAmount(request.sellItemPrice),
					customID: "RARIBLE",
					commissionAmount: fixAmount(comissionAmount.toString()),
					expiry: parseInt(details.expiry),
					marketplacesAddress: fee ? [toFlowAddress(fee.account)] : [],
					currency,
				}),
				auth
			)
			const tx = await waitForSeal(fcl, txId)
			const simpleOrderId = parseEvents<string>(tx.events, "ListingAvailable", "listingResourceID")
			return {
				...tx,
				orderId: simpleOrderId,
			}
		}

		const orderSaleCuts = await getOrderDetailsFromBlockchain(fcl, network, "sell", from, orderId)
		const txId = await runTransaction(
			fcl,
			map,
			getOrderCode(fcl, name).update(
				currency,
				orderId,
				calculateUpdateOrderSaleCuts(
					preparedOrder.take.value,
					request.sellItemPrice,
					orderSaleCuts.saleCuts,
				),
			),
			auth,
		)
		const tx = await waitForSeal(fcl, txId)
		const simpleOrderId = parseEvents<string>(tx.events, "ListingAvailable", "listingResourceID")
		return {
			...tx,
			orderId: simpleOrderId,
		}
	}
	throw new Error("Fcl is required for updating order")
}
