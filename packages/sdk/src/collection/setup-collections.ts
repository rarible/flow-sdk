import type {Maybe} from "@rarible/types"
import type {Fcl} from "@rarible/fcl-types"
import type {AuthWithPrivateKey, FlowNetwork, FlowTransaction} from "../types"
import {runTransaction, waitForSeal} from "../common/transaction"
import {CONFIGS} from "../config/config"
import {txInitNFTContractsAndStorefrontV2} from "../scripts/nft"

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
