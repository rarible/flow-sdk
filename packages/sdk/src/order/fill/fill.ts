import type { Fcl } from "@rarible/fcl-types"
import type { Maybe } from "@rarible/types/build/maybe"
import type { FlowAddress } from "@rarible/types"
import { toFlowAddress } from "@rarible/types"
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
import { getProtocolFee } from "../get-protocol-fee"
import { getPreparedOrder } from "../common/get-prepared-order"
import { calculateFees } from "../../common/calculate-fees"
import type { FlowContractAddress } from "../../common/flow-address"
import { runTransaction, waitForSeal } from "../../common/transaction"
import { getOrderCode } from "../../tx-code-store/order/storefront"
import {
	getOrderDetailsFromBlockchain,
} from "../common/get-order-details-from-blockchain"
import { fetchItemRoyalties } from "../common/fetch-item-royalties"
import { getMattelOrderCode } from "../../tx-code-store/order/mattel-storefront"
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
	originFee?: FlowOriginFees,
): Promise<FlowTransaction> {
	if (fcl) {

		const from = auth ? toFlowAddress((await auth()).addr) : toFlowAddress((await fcl.currentUser().snapshot()).addr!)
		if (!from) {
			throw new Error("FLOW-SDK: Can't get current user address")
		}
		const preparedOrder = await getPreparedOrder(orderApi, order)
		const { name, map } = getCollectionConfig(network, collection)
		switch (preparedOrder.type) {
			case "LIST": {
				if (name === "HWGarageCard" || name === "HWGaragePack") {
					const [fee] = preparedOrder.data.originalFees
					const txId = await runTransaction(
						fcl,
						map,
						getMattelOrderCode(fcl, name).buy({
							orderId: preparedOrder.id,
							address: owner,
							comissionRecipient: fee ? toFlowAddress(fee.account) : undefined,
						}),
						auth,
					)
					return waitForSeal(fcl, txId)
				}
				const blockChainOrder = await getOrderDetailsFromBlockchain(
					fcl, network, "sell", owner, preparedOrder.id,
				)
				let fees: FlowFee[] = []
				if (!blockChainOrder.isLegacy) {
					fees = calculateFees(preparedOrder.take.value, [
						...(originFee || []),
						getProtocolFee.percents(network).buyerFee,
					])
				}
				const txId = await runTransaction(
					fcl,
					map,
					getOrderCode(fcl, name).buy(
						currency,
						preparedOrder.id,
						owner,
						fees,
					),
					auth,
				)
				return waitForSeal(fcl, txId)
			}
			case "BID":
				const protocolFee: FlowFee[] = [getProtocolFee.percents(network).sellerFee]
				const { payouts: orderPayouts } = preparedOrder.data
				const payouts: FlowFee[] = !!orderPayouts.length ? orderPayouts : []
				/**
				 * remove owner from payouts, owner receive the rest of the money automatically
				 */
				const filteredPayouts = payouts.filter(p => p.account !== from)
				const royalties = network === "emulator" ? [] : await fetchItemRoyalties(itemApi, preparedOrder.itemId)
				/**
				 * fees included in price, royalties, originFees, protocolFees
				 */
				const includedFees: FlowFee[] = [
					...filteredPayouts,
					...(originFee || []),
					...royalties,
					...protocolFee,
				]
				return fillBidOrder(
					fcl,
					auth,
					currency,
					name,
					map,
					preparedOrder.id,
					owner,
					calculateFees(preparedOrder.make.value, includedFees),
				)
			default:
				throw new Error(`Unsupported order type: ${preparedOrder.type}`)
		}
	}
	throw new Error("Fcl is required for purchasing")
}
