import type { Fcl } from "@rarible/fcl-types"
import type { Currency } from "../types"
import { runScript } from "../common/transaction"
import { getBalanceCode } from "../txCodeStore/balance"
import type { Networks } from "../config"
import { CONFIGS } from "../config"

export async function getFungibleBalance(
	fcl: Fcl, network: Networks, address: string, currency: Currency,
): Promise<string> {
	const params = getBalanceCode(fcl, currency, address)
	try {
		const balance = await runScript(fcl, params, CONFIGS[network].mainAddressMap)
		return balance
	} catch (e) {
		throw new Error(`Flow-sdk error executing script: ${e}`)
	}

}
