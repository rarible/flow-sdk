import { Fcl } from "@rarible/fcl-types"
import * as t from "@onflow/types"
import {
	StorefrontCommon,
	StorefrontCommonNFT,
	StorefrontEvolution,
	StorefrontMotoGPCard,
	StorefrontTopShot,
} from "@rarible/flow-sdk-scripts"
import { CollectionName, Currency } from "../types"


type OrderMethods = Record<"buy" | "sell", string>
export type CodeByCurrency = Record<Currency, OrderMethods>
type OrderCode = Record<CollectionName, CodeByCurrency>

export const orderCode: OrderCode = {
	Rarible: {
		FLOW: {
			buy: StorefrontCommonNFT.buy_flow,
			sell: StorefrontCommonNFT.sell_flow,
		},
		FUSD: {
			buy: StorefrontCommonNFT.buy_fusd,
			sell: StorefrontCommonNFT.sell_fusd,
		},
	},
	CommonNFT: {
		FLOW: {
			buy: StorefrontCommonNFT.buy_flow,
			sell: StorefrontCommonNFT.sell_flow,
		},
		FUSD: {
			buy: StorefrontCommonNFT.buy_fusd,
			sell: StorefrontCommonNFT.sell_fusd,
		},
	},
	MotoGPCard: {
		FLOW: {
			buy: StorefrontMotoGPCard.buy_flow,
			sell: StorefrontMotoGPCard.sell_flow,
		},
		FUSD: {
			buy: StorefrontMotoGPCard.buy_fusd,
			sell: StorefrontMotoGPCard.sell_fusd,
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
			buy: StorefrontTopShot.buy_flow,
			sell: StorefrontTopShot.sell_flow,
		},
		FUSD: {
			buy: StorefrontTopShot.buy_fusd,
			sell: StorefrontTopShot.sell_fusd,
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
