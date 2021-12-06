import type { Fcl } from "@rarible/fcl-types"
import type { Maybe } from "@rarible/types/build/maybe"
import type { FlowContractAddress } from "@rarible/types"
import type { FlowOrder, FlowOrderControllerApi } from "@rarible/flow-api-client"
import type { AuthWithPrivateKey, FlowNetwork, FlowTransaction } from "../types"
import type { MethodArgs } from "../common/transaction"
import { runTransaction, waitForSeal } from "../common/transaction"
import { getOrderCode } from "../tx-code-store/order"
import { getCollectionConfig } from "../common/collection/get-config"
import { getBidCode } from "../tx-code-store/order/bid"
import { getPreparedOrder } from "./common/get-prepared-order"

export async function cancelOrder(
	fcl: Maybe<Fcl>,
	auth: AuthWithPrivateKey,
	network: FlowNetwork,
	orderApi: FlowOrderControllerApi,
	collection: FlowContractAddress,
	orderId: number | FlowOrder,
): Promise<FlowTransaction> {
	if (fcl) {
		const { name, map } = getCollectionConfig(network, collection)
		const order = await getPreparedOrder(orderApi, orderId)
		let params: MethodArgs
		switch (order.type) {
			case "LIST":
				params = getOrderCode(fcl, name).cancelOrder(order.id)
				break
			case "BID":
				params = getBidCode(fcl, name).cancel(order.id)
				break
			default:
				throw new Error(`Unknown order type: ${order.type}`)
		}
		const txId = await runTransaction(
			fcl,
			map,
			params,
			auth,
		)
		return waitForSeal(fcl, txId)
	}
	throw new Error("Fcl is required for cancelling order")
}
