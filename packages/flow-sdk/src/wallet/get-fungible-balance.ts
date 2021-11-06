import type { Fcl } from "@rarible/fcl-types"
import type { FlowCurrency, FlowNetwork } from "../types"
import { runScript } from "../common/transaction"
import { getBalanceCode } from "../tx-code-store/balance"
import { CONFIGS } from "../config"

export async function getFungibleBalance(
	fcl: Fcl,
	network: FlowNetwork,
	address: string,
	currency: FlowCurrency
): Promise<string> {
	const params = getBalanceCode(fcl, currency, address)
	return runScript(fcl, params, CONFIGS[network].mainAddressMap)
}
