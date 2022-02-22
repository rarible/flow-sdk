import * as t from "@onflow/types"
import type { Fcl } from "@rarible/fcl-types"
import { englishAuctionTxCode } from "@rarible/flow-sdk-scripts"
import { fixAmount } from "../../common/fix-amount"
import type { PreparedTransactionParamsResponse } from "../domain"
import type { FlowCurrency, FlowFee, NonFungibleContract } from "../../types/types"
import { prepareOrderCode } from "../order/common/prepare-order-code"
import { sansPrefix } from "../../common/prefix"
import { convertToAuctionParts } from "./common/convert-to-auction-parts"

type TxCreateEnglishAuctionLotRequest = {
	auctionContractAddress: string
	tokenId: number,
	parts: FlowFee[],
	minimumBid: string,
	buyoutPrice?: string,
	increment: string,
	startAt?: string,
	duration: string,
}

interface GetEnglishAuctionCode {
	createLot(request: TxCreateEnglishAuctionLotRequest): PreparedTransactionParamsResponse

	cancelLot(lotId: number): PreparedTransactionParamsResponse

	completeLot(lotId: number): PreparedTransactionParamsResponse

	createBid(
		auctionContractAddress: string, lotId: number, amount: string, parts: FlowFee[],
	): PreparedTransactionParamsResponse

	increaseBid(lotId: number, amount: string): PreparedTransactionParamsResponse

	updateProps(
		request: { minimalDuration?: string, maximalDuration?: string, reservePrice?: string },
	): PreparedTransactionParamsResponse

}

function getEnglishAuctionPartsType(auctionContractAddress: string) {
	return t.Array(t.Struct(
		`A.${sansPrefix(auctionContractAddress)}.EnglishAuction.Part`,
		[
			{ value: t.Address },
			{ value: t.UFix64 },
		],
	))
}

export function getEnglishAuctionCode(
	fcl: Fcl, name: NonFungibleContract, currency: FlowCurrency,
): GetEnglishAuctionCode {
	return {
		createLot: ({ auctionContractAddress, tokenId, minimumBid, buyoutPrice, increment, startAt, duration, parts }) => {
			return {
				cadence: prepareOrderCode(englishAuctionTxCode.addLot, name, currency),
				args: fcl.args([
					fcl.arg(tokenId, t.UInt64),
					fcl.arg(convertToAuctionParts(parts), getEnglishAuctionPartsType(auctionContractAddress)),
					fcl.arg(fixAmount(minimumBid), t.UFix64),
					fcl.arg(buyoutPrice ? fixAmount(buyoutPrice) : null, t.Optional(t.UFix64)),
					fcl.arg(fixAmount(increment), t.UFix64),
					fcl.arg(startAt ? fixAmount(startAt) : null, t.Optional(t.UFix64)),
					fcl.arg(fixAmount(duration), t.UFix64),
				]),
			}
		},
		cancelLot: (lotId) => {
			return {
				cadence: prepareOrderCode(englishAuctionTxCode.cancelLot, name, currency),
				args: fcl.args([fcl.arg(lotId, t.UInt64)]),
			}
		},
		completeLot: (lotId) => {
			return {
				cadence: prepareOrderCode(englishAuctionTxCode.completeLot, name, currency),
				args: fcl.args([fcl.arg(lotId, t.UInt64)]),
			}
		},
		createBid: (auctionContractAddress, lotId, amount, parts) => {
			return {
				cadence: prepareOrderCode(englishAuctionTxCode.addBid, name, currency),
				args: fcl.args([
					fcl.arg(lotId, t.UInt64),
					fcl.arg(fixAmount(amount), t.UFix64),
					fcl.arg(convertToAuctionParts(parts), getEnglishAuctionPartsType(auctionContractAddress)),
				]),
			}
		},
		increaseBid: (lotId, amount) => {
			return {
				cadence: prepareOrderCode(englishAuctionTxCode.incrementBid, name, currency),
				args: fcl.args([
					fcl.arg(lotId, t.UInt64),
					fcl.arg(fixAmount(amount), t.UFix64),
				]),
			}
		},
		updateProps: ({ minimalDuration, maximalDuration, reservePrice }) => {
			return {
				cadence: englishAuctionTxCode.updateProps,
				args: fcl.args([
					fcl.arg(minimalDuration ? fixAmount(minimalDuration) : null, t.Optional(t.UFix64)),
					fcl.arg(maximalDuration ? fixAmount(maximalDuration) : null, t.Optional(t.UFix64)),
					fcl.arg(reservePrice ? fixAmount(reservePrice) : null, t.Optional(t.UFix64)),
				]),
			}
		},
	}
}
