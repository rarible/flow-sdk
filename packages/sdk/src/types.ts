import type { CommonFlowTransaction } from "@rarible/fcl-types/build"
import type { FlowRoyalty } from "@rarible/flow-api-client"

export type FlowCurrency = "FLOW" | "FUSD"
export type FlowNetwork = "emulator" | "testnet" | "mainnet"

export interface FlowFee extends FlowRoyalty {
}

export type FlowOriginFees = FlowFee[]
export type FlowPayouts = FlowFee[]

export type FlowContractName =
	| NonFungibleTokenType
	| FungibleTokenType
	| FUSDType
	| FlowTokenType
	| NFTStorefrontType
	| MotoGPCardType
	| EvolutionType
	| TopShotType
	| RaribleFeeType
	| RaribleOrderType
	| RaribleNFTType
	| LicensedNFTType
	| TopShotFeeType
	| RaribleOpenBid
	| MugenNFT
	| CNN_NFT

export type FungibleContracts = FUSDType | FlowTokenType
export type NonFungibleContracts = RaribleNFTType | EvolutionType | MotoGPCardType | TopShotType | MugenNFT | CNN_NFT

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
export type MotoGPCardType = "MotoGPCard"
export type EvolutionType = "Evolution"
export type TopShotType = "TopShot"
export type RaribleFeeType = "RaribleFee"
export type RaribleOrderType = "RaribleOrder"
export type RaribleNFTType = "RaribleNFT"
export type LicensedNFTType = "LicensedNFT"
export type TopShotFeeType = "TopShotFee"
export type RaribleOpenBid = "RaribleOpenBid"
export type MugenNFT = "MugenNFT"
export type CNN_NFT = "CNN_NFT"
