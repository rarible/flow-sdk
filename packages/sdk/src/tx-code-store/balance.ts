import type { Fcl, FclArgs } from "@rarible/fcl-types"
import { getBalanceScripts } from "@rarible/flow-sdk-scripts"
import * as t from "@onflow/types"
import type { FlowCurrency } from "../types"
import {prepareFtCode} from "./order/prepare-order-code"

type GetBalanceCode = {
	cadence: string
	args: ReturnType<FclArgs>
}

export function getBalanceCode(fcl: Fcl, currency: FlowCurrency, address: string): GetBalanceCode {
	switch (currency) {
		case "FLOW":
		case "FUSD":
		case "USDC":
			return {
				cadence: prepareFtCode(getBalanceScripts.common, currency),
				args: fcl.args([fcl.arg(address, t.Address)]),
			}
		default:
			throw new Error("Flow-sdk Error: Unsupported currency")
	}
}
