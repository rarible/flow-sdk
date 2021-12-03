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
	create: (
		currency: FlowCurrency,
		itemId: number,
		price: string,
		fees: FlowFee[],
	) => GenerateCodeMethodResponse
	close: (currency: FlowCurrency, bidId: number, address: string) => GenerateCodeMethodResponse
}

export function getBidCode(fcl: Fcl, collectionName: FlowCollectionName): GenerateBidCodeResponse {
	return {
		create(currency, itemId, price, fees) {
			return {
				cadence: prepareBidCode("create", collectionName, currency),
				args: fcl.args([
					fcl.arg(itemId, t.UInt64), fcl.arg(price, t.UFix64), fcl.arg(prepareFees(fees), t.Dictionary({
						key: t.Address,
						value: t.UFix64,
					})),
				]),
			}
		},
		close(currency, bidId, openBidAddress) {
			return {
				cadence: prepareBidCode("close", collectionName, currency),
				args: fcl.args([fcl.arg(bidId, t.UInt64), fcl.arg(openBidAddress, t.Address)]),
			}
		},
	}
}

export function getCancelBidCode(fcl: Fcl, bidId: number): GenerateCodeMethodResponse {
	return {
		cadence: openBidTransactionCode.cancelBid.code,
		args: fcl.args([fcl.arg(bidId, t.UInt64)]),
	}
}
