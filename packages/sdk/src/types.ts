import type { CommonFlowTransaction } from "@rarible/fcl-types"
import type { FlowRoyalty } from "@rarible/flow-api-client"

export type FlowCurrency = "FLOW" | "FUSD" | "USDC"
export type FlowNetwork = "emulator" | "testnet" | "mainnet"

export interface FlowFee extends FlowRoyalty {
}

export type FlowOriginFees = FlowFee[]
export type FlowPayouts = FlowFee[]

export type FungibleContracts = FUSDType | FlowTokenType | FiatTokenType


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
	"GeniaceNFT",
	"CryptoPiggo",
	"HWGaragePack",
	"HWGaragePackV2",
	"HWGarageCard",
	"HWGarageCardV2",
	"HWGarageTokenV2",
	"BBxBarbiePack",
	"BBxBarbieCard",
	"BBxBarbieToken",
	"Gamisodes",
] as const

export type NonFungibleContracts = typeof NON_FUNGIBLE_CONTRACTS
export type NonFungibleContract = NonFungibleContracts[number]

export type FlowContractName =
	| NonFungibleTokenType
	| FungibleTokenType
	| NFTStorefrontType
	| NFTStorefrontV2
	| RaribleFeeType
	| RaribleOrderType
	| LicensedNFTType
	| TopShotFeeType
	| RaribleOpenBid
	| MetadataViews
	| FungibleContracts
	| NonFungibleContract
	| TokenForwarding
	| NiftoryNFTRegistry
	| NiftoryNonFungibleToken


export type AuthWithPrivateKey = undefined | ((account?: any) => Promise<any>)

export interface FlowTransaction extends CommonFlowTransaction {
	txId: string
}

export type { FlowEnv } from "./config/env"

export type NonFungibleTokenType = "NonFungibleToken"
export type FungibleTokenType = "FungibleToken"
export type FUSDType = "FUSD"
export type FlowTokenType = "FlowToken"
export type FiatTokenType = "FiatToken"
export type NFTStorefrontType = "NFTStorefront"
export type NFTStorefrontV2 = "NFTStorefrontV2"
export type RaribleFeeType = "RaribleFee"
export type RaribleOrderType = "RaribleOrder"
export type LicensedNFTType = "LicensedNFT"
export type TopShotFeeType = "TopShotFee"
export type RaribleOpenBid = "RaribleOpenBid"
export type MetadataViews = "MetadataViews"
export type NiftoryNFTRegistry = "NiftoryNFTRegistry"
export type NiftoryNonFungibleToken = "NiftoryNonFungibleToken"
export type TokenForwarding = "TokenForwarding"
