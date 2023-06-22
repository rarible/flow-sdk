import type { Fcl } from "@rarible/fcl-types"
import type { Maybe } from "@rarible/types/build/maybe"
import {checkInitMattelContracts} from "@rarible/flow-sdk-scripts/build/cadence/nft/mattel/check-init"
import t from "@onflow/types"
import {toFlowAddress} from "@rarible/types"
import type { AuthWithPrivateKey, FlowNetwork } from "../types"
import {runScript} from "../common/transaction"
import {CONFIGS} from "../config/config"

export async function isInitCollections(
	fcl: Maybe<Fcl>,
	auth: AuthWithPrivateKey,
	network: FlowNetwork,
): Promise<CollectionsInitStatus> {
	if (!fcl) {
		throw new Error("Fcl is required for setup collection on account")
	}
	const from = auth ? toFlowAddress((await auth()).addr) : toFlowAddress((await fcl.currentUser().snapshot()).addr!)
	return runScript(
		fcl,
		{
			cadence: checkInitMattelContracts,
			args: fcl.args([fcl.arg(from, t.Address)]),
		},
		CONFIGS[network].mainAddressMap
	)
}

export type CollectionsInitStatus = {
	FUSD: boolean
	FiatToken: boolean
	StorefrontV2: boolean
	HWGarageCard: boolean
	HWGarageCardV2: boolean
	HWGaragePack: boolean
	HWGaragePackV2: boolean
	BBxBarbieCard: boolean
	BBxBarbiePack: boolean
}
