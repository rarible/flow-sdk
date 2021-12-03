import type { Fcl } from "@rarible/fcl-types"
import type { Maybe } from "@rarible/types/build/maybe"
import type { FlowAddress, FlowContractAddress } from "@rarible/types"
import { toBigNumber, toFlowAddress } from "@rarible/types"
import type { FlowNftItemControllerApi, FlowOrder, FlowOrderControllerApi } from "@rarible/flow-api-client"
import type {
	AuthWithPrivateKey,
	FlowCurrency,
	FlowFee,
	FlowNetwork,
	FlowOriginFees,
	FlowTransaction,
} from "../../types"
import { getCollectionConfig } from "../../common/collection/get-config"
import { getProtocolFee } from "../../tx-code-store/get-protocol-fee"
import { getPreparedOrder } from "../common/get-prepared-order"
import { fillSellOrder } from "./fill-sell-order"
import { fillBidOrder } from "./fill-bid-order"

export type FlowOrderType = "LIST" | "BID"
export type FlowOrderWithType = { type: FlowOrderType } & FlowOrder

export async function fill(
	fcl: Maybe<Fcl>,
	auth: AuthWithPrivateKey,
	network: FlowNetwork,
	orderApi: FlowOrderControllerApi,
	itemApi: FlowNftItemControllerApi,
	collection: FlowContractAddress,
	currency: FlowCurrency,
	order: number | FlowOrder,
	owner: FlowAddress,
	originFee: FlowOriginFees,
): Promise<FlowTransaction> {
	if (fcl) {

		const from = auth ? toFlowAddress((await auth()).addr) : toFlowAddress((await fcl.currentUser().snapshot()).addr!)
		if (!from) {
			throw new Error("FLOW-SDK: Can't get current user address")
		}
		const preparedOrder = await getPreparedOrder(orderApi, order)
		const { name, map } = getCollectionConfig(network, collection)
		switch (preparedOrder.type) {
			case "LIST":
				return fillSellOrder(fcl, auth, currency, name, map, preparedOrder.id, owner, originFee)//todo fees
			case "BID":
				const protocolFee = await getProtocolFee(fcl, network)
				const { payouts: orderPayouts, originalFees: orderOriginFees } = preparedOrder.data
				const payouts: FlowFee[] = !!orderPayouts.length ? orderPayouts : [{ account: from, value: toBigNumber("1.0") }]
				const { royalties } = network === "emulator" ?
					{ royalties: [] } : await itemApi.getNftItemById({ itemId: preparedOrder.itemId })
				const includedFees: FlowFee[] = [
					...orderOriginFees,
					...royalties,
					protocolFee.sellerFee,
				]
				const extraFees: FlowFee[] = [
					...originFee,
					protocolFee.sellerFee,
				]
				return fillBidOrder(fcl, auth, currency, name, map, preparedOrder.id, owner, payouts, includedFees, extraFees)
			default:
				throw new Error(`Unsupported order type: ${preparedOrder.type}`)
		}
	}
	throw new Error("Fcl is required for purchasing")
}