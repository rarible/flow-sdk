import type { Fcl } from "@rarible/fcl-types"
import type { Maybe } from "@rarible/types/build/maybe"
import type { FlowAddress } from "@rarible/types"
import { toBigNumber } from "@rarible/types"
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
import { CONFIGS } from "../../config/config"
import { getAccountAddress } from "../../common/get-account-address"
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

		const from = await getAccountAddress(fcl, auth)
		const preparedOrder = await getPreparedOrder(orderApi, order)
		const { name, map } = getCollectionConfig(network, collection)
		switch (preparedOrder.type) {
			case "LIST":
				let fees: FlowFee[] = []
				const terminatorNum = CONFIGS[network].lastWithHardcodedOriginalFeesOrderNum
				if (
					preparedOrder.id > terminatorNum ||
					(preparedOrder.id <= terminatorNum && !["RaribleNFT", "Evolution", "MotoGPCard", "TopShot"].includes(name))
				) {
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
			case "BID":
				const protocolFee = getProtocolFee.percents(network)
				const { payouts: orderPayouts } = preparedOrder.data
				const payouts: FlowFee[] = !!orderPayouts.length ?
					orderPayouts :
					[{ account: from, value: toBigNumber("1.0") }]
				/**
				 * remove owner from payouts, owner receive the rest of the money
				 */
				const filteredPayouts = payouts.filter(p => p.account !== owner)
				const { royalties } = network === "emulator" ?
					{ royalties: [] } : await itemApi.getNftItemById({ itemId: preparedOrder.itemId })
				/**
				 * fees included in price, royalties, originFees, protocolFees
				 */
				const includedFees: FlowFee[] = [
					...filteredPayouts,
					...(originFee || []),
					...royalties,
					protocolFee.sellerFee,
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
