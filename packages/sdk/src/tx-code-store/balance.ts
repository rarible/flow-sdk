import type { Fcl, FclArgs } from "@rarible/fcl-types"
import * as t from "@onflow/types"
import type { FlowCurrency } from "../types"
import { getBalanceScripts } from "../scripts/wallet/balance"

type GetBalanceCode = {
	cadence: string
	args: ReturnType<FclArgs>
}

export function getBalanceCode(fcl: Fcl, currency: FlowCurrency, address: string): GetBalanceCode {
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
