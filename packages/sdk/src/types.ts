import type { CommonFlowTransaction } from "packages/fcl-types/build"

export type FlowCurrency = "FLOW" | "FUSD"
export type FlowNetwork = "emulator" | "testnet" | "mainnet"

export type FlowRoyalty = {
	account: string
	value: string
}

export type FlowContractName =
	| "NonFungibleToken"
	| "FungibleToken"
	| "FUSD"
	| "FlowToken"
	| "NFTStorefront"
	| "MotoGPCard"
	| "Evolution"
	| "TopShot"
	| "RaribleFee"
	| "RaribleOrder"
	| "RaribleNFT"
	| "LicensedNFT"
	| "TopShotFee"

export type AuthWithPrivateKey = undefined | ((account?: any) => Promise<any>)

export interface FlowTransaction extends CommonFlowTransaction {
	txId: string
}