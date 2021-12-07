import type { Fcl, FclArgs } from "@rarible/fcl-types"
import * as t from "@onflow/types"
import { StorefrontCommon } from "@rarible/flow-sdk-scripts"
import type { FlowRoyalty } from "@rarible/flow-api-client"
import type { FlowCurrency, FlowOriginFees, FlowPayouts } from "../../types"
import { fixAmount } from "../../common/fix-amount"
import type { FlowCollectionName } from "../../common/collection"
import { getCreateUpdateOrderCode, prepareFees } from "./get-create-order-code"
import { getBuyCode } from "./get-buy-code"


type OrderMethods = Record<"buy" | "sell" | "update", string>
export type CodeByCurrency = Record<FlowCurrency, OrderMethods>

type GenerateCodeMEthodResponse = {
	cadence: string,
	args: ReturnType<FclArgs>
}

type GenerateCodeResponse = {
	sell: (
		currency: FlowCurrency,
		tokenId: number,
		price: string,
		originFees: FlowOriginFees,
		royalties: FlowRoyalty[],
		payouts: FlowPayouts,
	) => GenerateCodeMEthodResponse
	buy: (currency: FlowCurrency, orderId: number, address: string, fees: FlowOriginFees) => GenerateCodeMEthodResponse
	update: (
		currency: FlowCurrency,
		orderId: number,
		price: string,
		tokenId: number,
		originFees: FlowOriginFees,
		royalties: FlowRoyalty[],
		payouts: FlowPayouts,
	) => GenerateCodeMEthodResponse
	cancelOrder: (orderId: number) => GenerateCodeMEthodResponse
}

export function getOrderCode(fcl: Fcl, collection: FlowCollectionName): GenerateCodeResponse {
	return {
		sell: (
			currency: FlowCurrency,
			tokenId: number,
			price: string,
			originFees: FlowOriginFees,
			royalties: FlowRoyalty[],
			payouts: FlowPayouts,
		) => {
			return {
				cadence: getCreateUpdateOrderCode("create", currency, collection),
				args: fcl.args([
					fcl.arg(tokenId, t.UInt64),
					fcl.arg(fixAmount(price), t.UFix64),
					fcl.arg(prepareFees(originFees), t.Dictionary({ key: t.Address, value: t.UFix64 })),
					fcl.arg(prepareFees(royalties), t.Dictionary({ key: t.Address, value: t.UFix64 })),
					fcl.arg(prepareFees(payouts), t.Dictionary({ key: t.Address, value: t.UFix64 })),
				]),
			}
		},
		buy: (currency: FlowCurrency, orderId: number, address: string, fees: FlowOriginFees) => {
			return {
				cadence: getBuyCode(currency, collection),
				args: fcl.args([
					fcl.arg(orderId, t.UInt64),
					fcl.arg(address, t.Address),
					fcl.arg(prepareFees(fees), t.Dictionary({ key: t.Address, value: t.UFix64 })),
				]),
			}
		},
		update: (
			currency: FlowCurrency,
			orderId: number,
			price: string,
			tokenId: number,
			originFees: FlowOriginFees,
			royalties: FlowRoyalty[],
			payouts: FlowPayouts,
		) => {
			return {
				cadence: getCreateUpdateOrderCode("update", currency, collection),
				args: fcl.args([
					fcl.arg(orderId, t.UInt64),
					fcl.arg(tokenId, t.UInt64),
					fcl.arg(price, t.UFix64),
					fcl.arg(prepareFees(originFees), t.Dictionary({ key: t.Address, value: t.UFix64 })),
					fcl.arg(prepareFees(royalties), t.Dictionary({ key: t.Address, value: t.UFix64 })),
					fcl.arg(prepareFees(payouts), t.Dictionary({ key: t.Address, value: t.UFix64 })),
				]),
			}
		},
		cancelOrder: (orderId: number) => {
			return {
				cadence: StorefrontCommon.remove_item,
				args: fcl.args([fcl.arg(orderId, t.UInt64)]),
			}
		},
	}
}
