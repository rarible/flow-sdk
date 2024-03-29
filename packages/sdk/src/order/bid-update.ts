import type { Fcl } from "@rarible/fcl-types"
import type { BigNumberLike, FlowContractAddress, Maybe } from "@rarible/types"
import { toFlowAddress } from "@rarible/types"
import type { FlowOrder, FlowOrderControllerApi } from "@rarible/flow-api-client"
import type { AuthWithPrivateKey, FlowCurrency, FlowNetwork } from "../types"
import { runTransaction, waitForSeal } from "../common/transaction"
import { getCollectionConfig } from "../common/collection/get-config"
import { getBidCode } from "../tx-code-store/order/rarible-open-bid"
import { parseEvents } from "../common/parse-tx-events"
import { fixAmount } from "../common/fix-amount"
import { getOrderDetailsFromBlockchain } from "./common/get-order-details-from-blockchain"
import type { FlowSellResponse } from "./sell"
import { getPreparedOrder } from "./common/get-prepared-order"
import { calculateUpdateOrderSaleCuts } from "./common/calculate-update-order-sale-cuts"
import {getOrderId} from "./common/get-order-id"

export async function bidUpdate(
	fcl: Maybe<Fcl>,
	auth: AuthWithPrivateKey,
	network: FlowNetwork,
	orderApi: FlowOrderControllerApi,
	collection: FlowContractAddress,
	currency: FlowCurrency,
	order: string | number | FlowOrder,
	price: BigNumberLike,
): Promise<FlowSellResponse> {
	if (fcl) {
		const from = auth ? toFlowAddress((await auth()).addr) : toFlowAddress((await fcl.currentUser().snapshot()).addr!)
		if (!from) {
			throw new Error("FLOW-SDK: Can't get current user address")
		}
		const preparedOrder = await getPreparedOrder(orderApi, order)
		const { name, map } = getCollectionConfig(network, collection)
		const orderId = getOrderId(preparedOrder.id)
		const bidSaleCuts = await getOrderDetailsFromBlockchain(fcl, network, "bid", from, orderId)
		const txId = await runTransaction(
			fcl,
			map,
			getBidCode(fcl, name).update(currency, orderId, fixAmount(price),
				calculateUpdateOrderSaleCuts(
					preparedOrder.make.value,
					price,
					bidSaleCuts.saleCuts,
				),
			),
			auth,
		)
		const txResponse = await waitForSeal(fcl, txId)
		const simpleOrderId = parseEvents<string>(txResponse.events, "BidAvailable", "bidId")
		return {
			...txResponse,
			orderId: simpleOrderId,
		}
	}
	throw new Error("Fcl is required for purchasing")
}
