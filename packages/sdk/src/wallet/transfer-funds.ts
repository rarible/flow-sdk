import type { Fcl } from "@rarible/fcl-types"
import * as t from "@onflow/types"
import type { BigNumberValue } from "@rarible/utils"
import { transferFlow as transferFlowCadence } from "@rarible/flow-sdk-scripts"
import type { Maybe } from "@rarible/types/build/maybe"
import type { FlowAddress } from "@rarible/types"
import type { AuthWithPrivateKey, FlowCurrency, FlowNetwork } from "../types"
import { runTransaction, waitForSeal } from "../common/transaction"
import { CONFIGS } from "../config/config"
import { fixAmount } from "../common/fix-amount"

export type TransferFlowRequest = {
	recipient: FlowAddress
	currency: FlowCurrency
	amount: BigNumberValue
}

export async function transferFunds(
	fcl: Maybe<Fcl>,
	network: FlowNetwork,
	auth: AuthWithPrivateKey,
	request: TransferFlowRequest,
) {
	if (fcl) {
		if (request.currency !== "FLOW") {
			throw new Error("Transfer is supporting only for FLOW")
		}

		const map = {
			FungibleToken: CONFIGS[network].mainAddressMap.FungibleToken,
			FlowToken: CONFIGS[network].mainAddressMap.FlowToken,
		}
		const txId = await runTransaction(
			fcl,
			map,
			{
				cadence: transferFlowCadence,
				args: fcl.args([
					fcl.arg(request.recipient, t.Address),
					fcl.arg(fixAmount(request.amount.toString()), t.UFix64),
				]),
			},
			auth,
		)
		return await waitForSeal(fcl, txId)
	}
	throw new Error("Fcl is required for transfer Flow")
}
