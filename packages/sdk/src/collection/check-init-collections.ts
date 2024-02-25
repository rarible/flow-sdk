import type { Fcl } from "@rarible/fcl-types"
import type { Maybe } from "@rarible/types/build/maybe"
import * as t from "@onflow/types"
import type { FlowAddress } from "@rarible/types"
import { toFlowAddress } from "@rarible/types"
import type { AuthWithPrivateKey, FlowNetwork } from "../types"
import { runScript } from "../common/transaction"
import { CONFIGS } from "../config/config"
import {checkInitMattelContracts} from "../scripts/nft/mattel/check-init"
import {checkInitGamisodesContracts} from "../scripts/nft/gamisodes/check-init"

export async function checkInitCollections(
	fcl: Maybe<Fcl>,
	auth: AuthWithPrivateKey,
	network: FlowNetwork,
	from?: FlowAddress
): Promise<CollectionsInitStatus> {
	if (!fcl) {
		throw new Error("Fcl is required for setup collection on account")
	}

	if (!from) {
		from = auth ? toFlowAddress((await auth()).addr) : toFlowAddress((await fcl.currentUser().snapshot()).addr!)
	}

	if (!from) {
		throw new Error("FLOW-SDK: Can't get current user address")
	}
	return runScript(
		fcl,
		{
			cadence: checkInitMattelContracts,
			args: fcl.args([fcl.arg(from, t.Address)]),
		},
		CONFIGS[network].mainAddressMap
	)
}

export async function checkInitGamisodesCollections(
	fcl: Maybe<Fcl>,
	auth: AuthWithPrivateKey,
	network: FlowNetwork,
	from?: FlowAddress
): Promise<GamisodesInitStatus> {
	if (!fcl) {
		throw new Error("Fcl is required for setup collection on account")
	}

	if (!from) {
		from = auth ? toFlowAddress((await auth()).addr) : toFlowAddress((await fcl.currentUser().snapshot()).addr!)
	}

	if (!from) {
		throw new Error("FLOW-SDK: Can't get current user address")
	}
	return runScript(
		fcl,
		{
			cadence: checkInitGamisodesContracts,
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

export type GamisodesInitStatus = {
	StorefrontV2: boolean
	FiatToken: boolean
	Gamisodes: boolean
}
