import type { Fcl } from "@rarible/fcl-types"
import { getBalanceScripts } from "@rarible/flow-sdk-scripts"
import * as t from "@onflow/types"
import type { FlowCurrency } from "../types/types"
import type { PreparedTransactionParamsResponse } from "./domain"


export function getBalanceCode(fcl: Fcl, currency: FlowCurrency, address: string): PreparedTransactionParamsResponse {
	const args = fcl.args([fcl.arg(address, t.Address)])
	switch (currency) {
		case "FLOW":
			return {
				cadence: getBalanceScripts.flow,
				args,
			}
		case "FUSD":
			return {
				cadence: getBalanceScripts.fusd,
				args,
			}
		default:
			throw new Error("Flow-sdk Error: Unsupported currency")
	}
}
