import { Fcl } from "@rarible/fcl-types"
import * as t from "@onflow/types"
import {
	StorefrontCommon,
	StorefrontCommonNft,
	StorefrontEvolution,
	StorefrontMotogpCard,
	StorefrontTopshot,
} from "@rarible/flow-sdk-scripts"
import { CollectionName, Currency } from "../types"


type OrderMethods = Record<"buy" | "sell", string>
export type CodeByCurrency = Record<Currency, OrderMethods>
type OrderCode = Record<CollectionName, CodeByCurrency>

export const orderCode: OrderCode = {
	Rarible: {
		FLOW: {
			buy: StorefrontCommonNft.buy_flow,
			sell: StorefrontCommonNft.sell_flow,
		},
		FUSD: {
			buy: StorefrontCommonNft.buy_fusd,
			sell: StorefrontCommonNft.sell_fusd,
		},
	},
	CommonNFT: {
		FLOW: {
			buy: StorefrontCommonNft.buy_flow,
			sell: StorefrontCommonNft.sell_flow,
		},
		FUSD: {
			buy: StorefrontCommonNft.buy_fusd,
			sell: StorefrontCommonNft.sell_fusd,
		},
	},
	MotoGPCard: {
		FLOW: {
			buy: StorefrontMotogpCard.buy_flow,
			sell: StorefrontMotogpCard.sell_flow,
		},
		FUSD: {
			buy: StorefrontMotogpCard.buy_fusd,
			sell: StorefrontMotogpCard.sell_fusd,
		},
	},
	Evolution: {
		FLOW: {
			buy: StorefrontEvolution.buy_flow,
			sell: StorefrontEvolution.sell_flow,
		},
		FUSD: {
			buy: StorefrontEvolution.buy_fusd,
			sell: StorefrontEvolution.sell_fusd,
		},
	},
	TopShot: {
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

export function getOrderCode(collection: CollectionName) {
	return {
		sell: (fcl: Fcl, currency: Currency, tokenId: number, price: string) => {
			return {
				cadence: orderCode[collection][currency].sell,
				args: fcl.args([fcl.arg(tokenId, t.UInt64), fcl.arg(price, t.UFix64)]),
			}
		},

		buy: (fcl: Fcl, currency: Currency, orderId: number, address: string) => {
			return {
				cadence: orderCode[collection][currency].buy,
				args: fcl.args([fcl.arg(orderId, t.UInt64), fcl.arg(address, t.Address)]),
			}
		},
		cancelOrder: (fcl: Fcl, orderId: number) => {
			return {
				cadence: StorefrontCommon.remove_item,
				args: fcl.args([fcl.arg(orderId, t.UInt64)]),
			}
		},
	}
}
