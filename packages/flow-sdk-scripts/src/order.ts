import { StorefrontCommonNft } from "./cadence/storefront/storefront-common-nft"
import { StorefrontMotogpCard } from "./cadence/storefront/storefront-motogp-card"
import { StorefrontEvolution } from "./cadence/storefront/storefront-evolution"
import { StorefrontTopshot } from "./cadence/storefront/storefront-topshot"
import { Currency } from "./index"

type CollectionName = "rarible" | "motoGp" | "evolution" | "topShot"
type OrderMethods = Record<"buy" | "sell", string>
export type CodeByCurrency = Record<Currency, OrderMethods>
type OrderCode = Record<CollectionName, CodeByCurrency>

export const orderCode: OrderCode = {
	rarible: {
		FLOW: {
			buy: StorefrontCommonNft.buy_flow,
			sell: StorefrontCommonNft.sell_flow,
		},
		FUSD: {
			buy: StorefrontCommonNft.buy_fusd,
			sell: StorefrontCommonNft.sell_fusd,
		},
	},
	motoGp: {
		FLOW: {
			buy: StorefrontMotogpCard.buy_flow,
			sell: StorefrontMotogpCard.sell_flow,
		},
		FUSD: {
			buy: StorefrontMotogpCard.buy_fusd,
			sell: StorefrontMotogpCard.sell_fusd,
		},
	},
	evolution: {
		FLOW: {
			buy: StorefrontEvolution.buy_flow,
			sell: StorefrontEvolution.sell_flow,
		},
		FUSD: {
			buy: StorefrontEvolution.buy_fusd,
			sell: StorefrontEvolution.sell_fusd,
		},
	},
	topShot: {
		FLOW: {
			buy: StorefrontTopshot.buy_flow,
			sell: StorefrontTopshot.sell_flow,
		},
		FUSD: {
			buy: StorefrontTopshot.buy_fusd,
			sell: StorefrontTopshot.sell_fusd,
		},
	},
}
