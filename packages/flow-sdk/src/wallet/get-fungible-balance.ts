import { Fcl } from "@rarible/fcl-types"
import { BigNumber, toBigNumber } from "@rarible/types"
import { Currency } from "../types"
import { runScript } from "../common/transaction"
import { getBalanceCode } from "../txCodeStore/balance"
import { CONFIGS, Networks } from "../config"

export async function getFungibleBalance(
	fcl: Fcl, network: Networks, currency: Currency, address: string,
): Promise<BigNumber> {
	const paramss = getBalanceCode(fcl, currency, address)
	try {
		const balance = await runScript(fcl, paramss, CONFIGS[network].mainAddressMap)
		return toBigNumber(balance)
	} catch (e) {
		throw Error(`Flow-sdk error executing script: ${e}`)
	}

}
