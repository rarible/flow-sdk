import type { Fcl } from "@rarible/fcl-types"
import * as t from "@onflow/types"
import type { BigNumberValue } from "@rarible/utils"
import type { Maybe } from "@rarible/types/build/maybe"
import type { FlowAddress } from "@rarible/types"
import type { AuthWithPrivateKey, FlowCurrency, FlowNetwork } from "../types"
import { runTransaction, waitForSeal } from "../common/transaction"
import { CONFIGS } from "../config/config"
import { fixAmount } from "../common/fix-amount"
import {prepareFtCode} from "../tx-code-store/order/prepare-order-code"
import {transfer} from "../scripts/wallet/transfer"

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
		const txId = await runTransaction(
			fcl,
			CONFIGS[network].mainAddressMap,
			{
				cadence: prepareFtCode(transfer, request.currency),
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
