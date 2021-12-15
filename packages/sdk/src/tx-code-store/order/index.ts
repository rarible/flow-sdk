import type { Fcl, FclArgs } from "@rarible/fcl-types"
import * as t from "@onflow/types"
import { StorefrontCommon } from "@rarible/flow-sdk-scripts"
import type { FlowCurrency } from "../../types"


type OrderMethods = Record<"buy" | "sell" | "update", string>
export type CodeByCurrency = Record<FlowCurrency, OrderMethods>

type GenerateCodeMEthodResponse = {
	cadence: string,
	args: ReturnType<FclArgs>
}

type GenerateCodeResponse = {
	cancelOrder: (orderId: number) => GenerateCodeMEthodResponse
}

export function getOrderCode(fcl: Fcl): GenerateCodeResponse {
	return {
		cancelOrder: (orderId: number) => {
			return {
				cadence: StorefrontCommon.remove_item,
				args: fcl.args([fcl.arg(orderId, t.UInt64)]),
			}
		},
	}
}
