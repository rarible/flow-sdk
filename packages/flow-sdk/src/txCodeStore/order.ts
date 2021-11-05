import type { Fcl, FclArgs } from "@rarible/fcl-types"
import * as t from "@onflow/types"
import {
	StorefrontCommon,
	StorefrontEvolution,
	StorefrontMotoGPCard,
	StorefrontRaribleNFT,
	StorefrontTopShot,
} from "@rarible/flow-sdk-scripts"
import type { CollectionName, Currency } from "../types"


type OrderMethods = Record<"buy" | "sell" | "update", string>
export type CodeByCurrency = Record<Currency, OrderMethods>
type OrderCode = Record<CollectionName, CodeByCurrency>

export const orderCode: OrderCode = {
	RaribleNFT: {
		FLOW: {
			buy: StorefrontRaribleNFT.buy_flow,
			sell: StorefrontRaribleNFT.sell_flow,
			update: StorefrontRaribleNFT.update_flow,
		},
		FUSD: {
			buy: StorefrontRaribleNFT.buy_fusd,
			sell: StorefrontRaribleNFT.sell_fusd,
			update: StorefrontRaribleNFT.update_fusd,
		},
	},
	MotoGPCard: {
		FLOW: {
			buy: StorefrontMotoGPCard.buy_flow,
			sell: StorefrontMotoGPCard.sell_flow,
			update: StorefrontMotoGPCard.update_flow,
		},
		FUSD: {
			buy: StorefrontMotoGPCard.buy_fusd,
			sell: StorefrontMotoGPCard.sell_fusd,
			update: StorefrontMotoGPCard.update_fusd,
		},
	},
	Evolution: {
		FLOW: {
			buy: StorefrontEvolution.buy_flow,
			sell: StorefrontEvolution.sell_flow,
			update: StorefrontEvolution.update_flow,
		},
		FUSD: {
			buy: StorefrontEvolution.buy_fusd,
			sell: StorefrontEvolution.sell_fusd,
			update: StorefrontEvolution.update_fusd,
		},
	},
	TopShot: {
		FLOW: {
			buy: StorefrontTopShot.buy_flow,
			sell: StorefrontTopShot.sell_flow,
			update: StorefrontTopShot.update_flow,
		},
		FUSD: {
			buy: StorefrontTopShot.buy_fusd,
			sell: StorefrontTopShot.sell_fusd,
			update: StorefrontTopShot.update_fusd,
		},
	},
}

type GenerateCodeMEthodResponse = {
	cadence: string,
	args: ReturnType<FclArgs>
}
type GenerateCodeMethod = (...args: any) => GenerateCodeMEthodResponse

type GenerateCodeResponse = Record<"sell" | "buy" | "update" | "cancelOrder", GenerateCodeMethod>

export function getOrderCode(collection: CollectionName): GenerateCodeResponse {
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
		update: (fcl: Fcl, currency: Currency, orderId: number, price: string) => {
			return {
				cadence: orderCode[collection][currency].update,
				args: fcl.args([fcl.arg(orderId, t.UInt64), fcl.arg(price, t.UFix64)]),
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
