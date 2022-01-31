import type { CommonFlowTransaction } from "@rarible/fcl-types/build"
import type { FlowRoyalty } from "@rarible/flow-api-client"

export type FlowCurrency = "FLOW" | "FUSD"
export type FlowNetwork = "emulator" | "testnet" | "mainnet"

export interface FlowFee extends FlowRoyalty {
}

export type FlowOriginFees = FlowFee[]
export type FlowPayouts = FlowFee[]

export type FungibleContracts = FUSDType | FlowTokenType

export type NonFungibleContracts =
	RaribleNFTType |
	EvolutionType |
	MotoGPCardType |
	TopShotType |
	MugenNFT |
	CNN_NFT |
	MatrixWorldFlowFestNFT |
	MatrixWorldVoucher |
	DisruptArt |
	Art |
	StarlyCard |
	OneFootballCollectible |
	ChainmonstersRewards

export type FlowContractName =
	| NonFungibleTokenType
	| FungibleTokenType
	| NFTStorefrontType
	| RaribleFeeType
	| RaribleOrderType
	| LicensedNFTType
	| TopShotFeeType
	| RaribleOpenBid
	| FungibleContracts
	| NonFungibleContracts


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
export type MotoGPCardType = "MotoGPCard"
export type EvolutionType = "Evolution"
export type TopShotType = "TopShot"
export type RaribleNFTType = "RaribleNFT"
export type MugenNFT = "MugenNFT"
export type CNN_NFT = "CNN_NFT"
export type MatrixWorldFlowFestNFT = "MatrixWorldFlowFestNFT"
export type MatrixWorldVoucher = "MatrixWorldVoucher"
export type DisruptArt = "DisruptArt"
export type Art = "Art"
export type StarlyCard = "StarlyCard"
export type OneFootballCollectible = "OneFootballCollectible"
export type ChainmonstersRewards = "ChainmonstersRewards"
