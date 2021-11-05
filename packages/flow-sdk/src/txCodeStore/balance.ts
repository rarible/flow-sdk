import type { Fcl, FclArgs } from "@rarible/fcl-types"
import { getBalanceScripts } from "@rarible/flow-sdk-scripts"
import * as t from "@onflow/types"
import type { Currency } from "../types"

type GetBalanceCode = {
	cadence: string,
	args: ReturnType<FclArgs>
}

export function getBalanceCode(fcl: Fcl, currency: Currency, address: string): GetBalanceCode {
	const args = fcl.args([fcl.arg(address, t.Address)])
	switch (currency) {
		case "FLOW": {
			return {
				cadence: getBalanceScripts.flow,
				args,
			}
		}
		case "FUSD": {
			return {
				cadence: getBalanceScripts.fusd,
				args,
			}
		}
		default: {
			throw new Error("Flow-sdk Error: Unsupported currency")
		}
	}
}
