export { commonNftTransactions, nftStorefrontTransactions } from "./cadence/rarible/scripts"
export { CommonNft } from "./cadence/rarible/common-nft"
export { motogpCardTransactions } from "./cadence/motogp/motogp-card-transactions"
export { motogpPackTransactions } from "./cadence/motogp/motogp-pack-transactions"
export { evolutionTransactions } from "./cadence/evolution/evolution-transactions"
export { StorefrontCommon } from "./cadence/storefront/storefront-common"
export { StorefrontMotogpCard } from "./cadence/storefront/storefront-motogp-card"
export { StorefrontCommonNft } from "./cadence/storefront/storefront-common-nft"
export { StorefrontTopshot } from "./cadence/storefront/storefront-topshot"
export { StorefrontEvolution } from "./cadence/storefront/storefront-evolution"

export type Currency = "FLOW" | "FUSD"
export type Royalty = {
	account: string
	value: string
}
