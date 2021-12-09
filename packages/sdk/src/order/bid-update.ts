import type { Fcl } from "@rarible/fcl-types"
import type { Maybe } from "@rarible/types/build/maybe"
import type { BigNumber } from "@rarible/types"
import type { FlowOrder, FlowOrderControllerApi } from "@rarible/flow-api-client"
import type { AuthWithPrivateKey, FlowCurrency, FlowNetwork } from "../types"
import { runTransaction, waitForSeal } from "../common/transaction"
import { getCollectionConfig } from "../common/collection/get-config"
import { getBidCode } from "../tx-code-store/order/bid"
import { calculateFees } from "../common/calculate-fees"
import { parseEvents } from "../common/parse-tx-events"
import type { FlowContractAddress } from "../common/flow-address"
import { getProtocolFee } from "./get-protocol-fee"
import type { FlowSellResponse } from "./sell"
import { getPreparedOrder } from "./common/get-prepared-order"

export async function bidUpdate(
	fcl: Maybe<Fcl>,
	auth: AuthWithPrivateKey,
	network: FlowNetwork,
	orderApi: FlowOrderControllerApi,
	collection: FlowContractAddress,
	currency: FlowCurrency,
	order: number | FlowOrder,
	price: BigNumber,
): Promise<FlowSellResponse> {
	if (fcl) {
		const preparedOrder = await getPreparedOrder(orderApi, order)
		const { name, map } = getCollectionConfig(network, collection)
		const protocolFees = getProtocolFee(network)
		const txId = await runTransaction(
			fcl,
			map,
			getBidCode(fcl, name).update(currency, preparedOrder.id, price,
				[
					...calculateFees(price, [protocolFees.buyerFee]),
					...calculateFees(price, preparedOrder.data.originalFees || []),
				]),
			auth,
		)
		const txResponse = await waitForSeal(fcl, txId)
		const simpleOrderId = parseEvents<string>(txResponse.events, "BidAvailable", "bidId")
		return {
			...txResponse,
			orderId: parseInt(simpleOrderId),
		}
	}
	throw new Error("Fcl is required for purchasing")
}
