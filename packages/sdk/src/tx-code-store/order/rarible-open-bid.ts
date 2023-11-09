import type { Fcl, FclArgs } from "@rarible/fcl-types"
import * as t from "@onflow/types"
import { openBidTransactionCode } from "@rarible/flow-sdk-scripts"
import type { FlowCurrency, FlowFee, NonFungibleContract } from "../../types"
import { prepareFees } from "../common/conver-fee-to-cadence"
import { fixAmount } from "../../common/fix-amount"
import { prepareOrderCode } from "./prepare-order-code"

type GenerateCodeMethodResponse = {
	cadence: string,
	args: ReturnType<FclArgs>
}

type GenerateBidCodeResponse = {
	create: (currency: FlowCurrency, itemId: number, price: string, fees: FlowFee[]) => GenerateCodeMethodResponse
	close: (currency: FlowCurrency, bidId: string, address: string, fees: FlowFee[]) => GenerateCodeMethodResponse
	update: (currency: FlowCurrency, bidId: string, price: string, fees: FlowFee[]) => GenerateCodeMethodResponse
	cancel: (bidId: string) => GenerateCodeMethodResponse
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
		cancel(bidId: string) {
			return {
				cadence: openBidTransactionCode.cancelBid,
				args: fcl.args([fcl.arg(bidId, t.UInt64)]),
			}
		},
	}
}
