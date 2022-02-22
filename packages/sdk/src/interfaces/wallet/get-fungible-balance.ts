import type { Fcl } from "@rarible/fcl-types"
import type { Maybe } from "@rarible/types/build/maybe"
import type { FlowAddress } from "@rarible/types"
import type { FlowCurrency, FlowNetwork } from "../../types"
import { runScript } from "../../common/transaction"
import { getBalanceCode } from "../../blockchain-api/balance"
import { CONFIGS } from "../../config/config"

export async function getFungibleBalance(
	fcl: Maybe<Fcl>,
	network: FlowNetwork,
	address: FlowAddress,
	currency: FlowCurrency,
): Promise<string> {
	if (fcl) {
		const params = getBalanceCode(fcl, currency, address)
		return runScript(fcl, params, CONFIGS[network].mainAddressMap)
	}
	throw new Error("Fcl is required for balance request")
}
