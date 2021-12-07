import type { Fcl, FclArgs } from "@rarible/fcl-types"
import * as t from "@onflow/types"
import { openBidTransactionCode } from "@rarible/flow-sdk-scripts/src"
import type { FlowCollectionName } from "../../common/collection"
import type { FlowCurrency, FlowFee } from "../../types"
import { prepareBidCode } from "./prepare-bid-code"
import { prepareFees } from "./get-create-order-code"

type GenerateCodeMethodResponse = {
	cadence: string,
	args: ReturnType<FclArgs>
}

type GenerateBidCodeResponse = {
	create: (currency: FlowCurrency, itemId: number, price: string, fees: FlowFee[]) => GenerateCodeMethodResponse
	close: (currency: FlowCurrency, bidId: number, address: string, fees: FlowFee[]) => GenerateCodeMethodResponse
	update: (currency: FlowCurrency, bidId: number, price: string, fees: FlowFee[]) => GenerateCodeMethodResponse
	cancel: (bidId: number) => GenerateCodeMethodResponse
}

export function getBidCode(fcl: Fcl, collectionName: FlowCollectionName): GenerateBidCodeResponse {
	return {
		create(currency, itemId, price, fees) {
			return {
				cadence: prepareBidCode(openBidTransactionCode.openBid, collectionName, currency),
				args: fcl.args([
					fcl.arg(itemId, t.UInt64), fcl.arg(price, t.UFix64), fcl.arg(prepareFees(fees), t.Dictionary({
						key: t.Address,
						value: t.UFix64,
					})),
				]),
			}
		},
		update(currency, bidId, price, fees) {
			return {
				cadence: prepareBidCode(openBidTransactionCode.updateBid, collectionName, currency),
				args: fcl.args([
					fcl.arg(bidId, t.UInt64),
					fcl.arg(price, t.UFix64),
					fcl.arg(prepareFees(fees), t.Dictionary({
						key: t.Address,
						value: t.UFix64,
					})),
				]),
			}
		},
		close(currency, bidId, openBidAddress, fees) {
			return {
				cadence: prepareBidCode(openBidTransactionCode.closeBid, collectionName, currency),
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
