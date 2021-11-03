import { Fcl } from "@rarible/fcl-types"
import { Currency } from "../types"
import { runScript } from "../common/transaction"
import { getBalanceCode } from "../txCodeStore/balance"
import { CONFIGS, Networks } from "../config"

export async function getFungibleBalance(
	fcl: Fcl, network: Networks, address: string, currency: Currency,
): Promise<string> {
	const params = getBalanceCode(fcl, currency, address)
	try {
		const balance = await runScript(fcl, params, CONFIGS[network].mainAddressMap)
		return balance
	} catch (e) {
		throw Error(`Flow-sdk error executing script: ${e}`)
	}

}
