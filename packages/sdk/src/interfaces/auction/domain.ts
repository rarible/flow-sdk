import type { FlowCurrency, FlowFee, FlowOriginFees, FlowPayouts, FlowTransaction } from "../../types"
import type { FlowContractAddress } from "../../types/contract-address"
import type { FlowItemId } from "../../types/item"

type EnglishAuctionRequest = {
	collection: FlowContractAddress
}

type EnglishAuctionLotIdDomain = {
	lotId: string
}

export type EnglishAuctionCreateRequest = EnglishAuctionRequest & {
	currency: FlowCurrency,
	itemId: FlowItemId,
	minimumBid: string,
	buyoutPrice?: string,
	increment: string,
	startAt?: string,
	duration: string,
	originFees?: FlowOriginFees,
	payouts?: FlowPayouts,
}

export type EnglishAuctionCompleteRequest = EnglishAuctionRequest & EnglishAuctionLotIdDomain

export type EnglishAuctionCancelRequest = EnglishAuctionRequest & EnglishAuctionLotIdDomain

export type EnglishAuctionCreateBidRequest = EnglishAuctionRequest & EnglishAuctionLotIdDomain & {
	amount: string,
	originFee?: FlowFee[]
}

export type EnglishAuctionIncreaseBidRequest = EnglishAuctionRequest & EnglishAuctionLotIdDomain & {
	amount: string,
}

export type FlowEnglishAuctionTransaction = FlowTransaction & EnglishAuctionLotIdDomain
