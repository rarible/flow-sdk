export type Currency = "FLOW" | "FUSD"
export type Royalty = {
	account: string
	value: string
}
export type FlowAddress = string
export type CollectionName = "MotoGPCard" | "Evolution" | "TopShot" | "RaribleNFT"
export type AuthWithPrivateKey = undefined | ((account?: any) => Promise<any>)
