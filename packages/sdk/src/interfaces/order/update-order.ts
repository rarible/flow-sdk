import type { Fcl } from "@rarible/fcl-types"
import type { Maybe } from "@rarible/types/build/maybe"
import type { BigNumber } from "@rarible/types"
import type { FlowOrder, FlowOrderControllerApi } from "@rarible/flow-api-client"
import type { AuthWithPrivateKey, FlowCurrency, FlowNetwork } from "../../types/types"
import { runTransaction, waitForSeal } from "../../common/transaction"
import { parseEvents } from "../../common/parse-tx-events"
import { getOrderCode } from "../../blockchain-api/order/storefront"
import type { FlowContractAddress } from "../../types/contract-address"
import { getCollectionConfig } from "../../config/utils"
import { getAccountAddress } from "../../common/get-account-address"
import { checkPrice } from "./common/check-price"
import { getOrderDetailsFromBlockchain } from "./common/get-order-details-from-blockchain"
import { getPreparedOrder } from "./common/get-prepared-order"
import type { FlowSellResponse } from "./sell"
import { calculateUpdateOrderSaleCuts } from "./common/calculate-update-order-sale-cuts"

export type FlowUpdateOrderRequest = {
	collection: FlowContractAddress,
	currency: FlowCurrency,
	order: number | FlowOrder,
	sellItemPrice: BigNumber,
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
		const from = await getAccountAddress(fcl, auth)
		const preparedOrder = await getPreparedOrder(orderApi, order)
		const { name, map } = getCollectionConfig(network, collection)

		const orderSaleCuts = await getOrderDetailsFromBlockchain(fcl, network, "sell", from, preparedOrder.id)
		const txId = await runTransaction(
			fcl,
			map,
			getOrderCode(fcl, name).update(
				currency,
				preparedOrder.id,
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
			orderId: parseInt(simpleOrderId),
		}
	}
	throw new Error("Fcl is required for updating order")
}
