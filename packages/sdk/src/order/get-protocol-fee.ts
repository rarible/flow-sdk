import type { Fcl } from "@rarible/fcl-types"
import { raribleFee } from "@rarible/flow-sdk-scripts"
import { toBigNumber, toFlowAddress } from "@rarible/types"
import * as t from "@onflow/types"
import type { Maybe } from "@rarible/types/build/maybe"
import type { FlowFee, FlowNetwork } from "../types"
import { CONFIGS } from "../config/config"
import { runScript } from "../common/transaction"

export type ProtocolFees = {
	buyerFee: FlowFee
	sellerFee: FlowFee
}

export async function getProtocolFee(fcl: Maybe<Fcl>, network: FlowNetwork): Promise<ProtocolFees> {
	if (fcl) {
		const map = CONFIGS[network].mainAddressMap
		const { buyerFee, sellerFee } = await runScript(
			fcl,
			{ cadence: raribleFee.getFees },
			map,
		)
		const feeAddress = await runScript(fcl, {
			cadence: raribleFee.getFeesAddressByName,
			args: fcl.args([fcl.arg("rarible", t.String)]),
		}, map)
		return {
			buyerFee: { account: toFlowAddress(feeAddress), value: toBigNumber(buyerFee) },
			sellerFee: { account: toFlowAddress(feeAddress), value: toBigNumber(sellerFee) },
		}
	}
	throw new Error("Fcl is required for get protocol fee")
}
