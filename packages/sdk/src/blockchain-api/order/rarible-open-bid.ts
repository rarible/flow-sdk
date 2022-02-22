import type { Fcl } from "@rarible/fcl-types"
import * as t from "@onflow/types"
import { openBidTransactionCode } from "@rarible/flow-sdk-scripts"
import type { FlowCurrency, FlowFee, NonFungibleContract } from "../../types"
import { prepareFees } from "../common/convert-fee-to-cadence"
import { fixAmount } from "../../common/fix-amount"
import type { PreparedTransactionParamsResponse } from "../domain"
import { prepareOrderCode } from "./common/prepare-order-code"

type GenerateBidCodeResponse = {
	create: (currency: FlowCurrency, itemId: number, price: string, fees: FlowFee[]) => PreparedTransactionParamsResponse
	close: (currency: FlowCurrency, bidId: number, address: string, fees: FlowFee[]) => PreparedTransactionParamsResponse
	update: (currency: FlowCurrency, bidId: number, price: string, fees: FlowFee[]) => PreparedTransactionParamsResponse
	cancel: (bidId: number) => PreparedTransactionParamsResponse
}

export function getBidCode(fcl: Fcl, collectionName: NonFungibleContract): GenerateBidCodeResponse {
	return {
		create(currency, itemId, price, fees) {
			return {
				cadence: prepareOrderCode(openBidTransactionCode.openBid, collectionName, currency),
				args: fcl.args([
					fcl.arg(itemId, t.UInt64), fcl.arg(fixAmount(price), t.UFix64), fcl.arg(prepareFees(fees), t.Dictionary({
						key: t.Address,
						value: t.UFix64,
					})),
				]),
			}
		},
		update(currency, bidId, price, fees) {
			return {
				cadence: prepareOrderCode(openBidTransactionCode.updateBid, collectionName, currency),
				args: fcl.args([
					fcl.arg(bidId, t.UInt64),
					fcl.arg(fixAmount(price), t.UFix64),
					fcl.arg(prepareFees(fees), t.Dictionary({
						key: t.Address,
						value: t.UFix64,
					})),
				]),
			}
		},
		close(currency, bidId, openBidAddress, fees) {
			return {
				cadence: prepareOrderCode(openBidTransactionCode.closeBid, collectionName, currency),
				args: fcl.args([
					fcl.arg(bidId, t.UInt64), fcl.arg(openBidAddress, t.Address), fcl.arg(prepareFees(fees), t.Dictionary({
						key: t.Address,
						value: t.UFix64,
					})),
				]),
			}
		},
		cancel(bidId: number) {
			return {
				cadence: openBidTransactionCode.cancelBid,
				args: fcl.args([fcl.arg(bidId, t.UInt64)]),
			}
		},
	}
}
