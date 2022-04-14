import type { CommonFlowTransaction } from "@rarible/fcl-types"
import type { FlowRoyalty } from "@rarible/flow-api-client"

export type FlowCurrency = "FLOW" | "FUSD"
export type FlowNetwork = "emulator" | "testnet" | "mainnet"

export interface FlowFee extends FlowRoyalty {
}

export type FlowOriginFees = FlowFee[]
export type FlowPayouts = FlowFee[]

export type FungibleContracts = FUSDType | FlowTokenType


export const NON_FUNGIBLE_CONTRACTS = [
	"RaribleNFT",
	"Evolution",
	"MotoGPCard",
	"TopShot",
	"MugenNFT",
	"CNN_NFT",
	"MatrixWorldFlowFestNFT",
	"MatrixWorldVoucher",
	"DisruptArt",
	"Art",
	"StarlyCard",
	"OneFootballCollectible",
	"ChainmonstersRewards",
	"BarterYardPackNFT",
	"Moments",
	"FanfareNFTContract",
	"Kicks",
	"SomePlaceCollectible",
	"IrNFT",
	"IrVoucher",
] as const

export type NonFungibleContracts = typeof NON_FUNGIBLE_CONTRACTS
export type NonFungibleContract = NonFungibleContracts[number]

export type FlowContractName =
	| NonFungibleTokenType
	| FungibleTokenType
	| NFTStorefrontType
	| RaribleFeeType
	| RaribleOrderType
	| LicensedNFTType
	| TopShotFeeType
	| RaribleOpenBid
	| MetadataViews
	| FungibleContracts
	| NonFungibleContract


export type AuthWithPrivateKey = undefined | ((account?: any) => Promise<any>)

export interface FlowTransaction extends CommonFlowTransaction {
	txId: string
}

export type { FlowEnv } from "./config/env"

export type NonFungibleTokenType = "NonFungibleToken"
export type FungibleTokenType = "FungibleToken"
export type FUSDType = "FUSD"
export type FlowTokenType = "FlowToken"
export type NFTStorefrontType = "NFTStorefront"
export type RaribleFeeType = "RaribleFee"
export type RaribleOrderType = "RaribleOrder"
export type LicensedNFTType = "LicensedNFT"
export type TopShotFeeType = "TopShotFee"
export type RaribleOpenBid = "RaribleOpenBid"
export type MetadataViews = "MetadataViews"
