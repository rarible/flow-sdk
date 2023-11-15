import type {Maybe} from "@rarible/types/build/maybe"
import type {Fcl} from "@rarible/fcl-types"
import {txInitNFTContractsAndStorefrontV2} from "@rarible/flow-sdk-scripts"
import type {AuthWithPrivateKey, FlowNetwork, FlowTransaction} from "../types"
import {runTransaction, waitForSeal} from "../common/transaction"
import {CONFIGS} from "../config/config"

export async function setupCollections(
	fcl: Maybe<Fcl>,
	auth: AuthWithPrivateKey,
	network: FlowNetwork,
): Promise<FlowTransaction> {
	if (!fcl) {
		throw new Error("Fcl is required for setup collection on account")
	}
	const txId = await runTransaction(
		fcl,
		CONFIGS[network].mainAddressMap,
		{
			cadence: txInitNFTContractsAndStorefrontV2,
			args: fcl.args([]),
		},
		auth,
	)
	return waitForSeal(fcl, txId)
}
