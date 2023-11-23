import type { Fcl } from "@rarible/fcl-types"
import type { Maybe } from "@rarible/types/build/maybe"
import type { AuthWithPrivateKey, FlowNetwork, FlowTransaction } from "../types"
import type { FlowContractAddress } from "../common/flow-address"
import { runTransaction, waitForSeal } from "../common/transaction"
import { getNftCode } from "../tx-code-store/nft"
import { getCollectionConfig } from "../common/collection/get-config"
import {getWhitelabelOrderCode, isWhitelabelCollection} from "../tx-code-store/order/whitelabel-storefront"
import {CONFIGS} from "../config/config"
import {txInitVault} from "../scripts/nft"

export async function setupAccount(
	fcl: Maybe<Fcl>,
	auth: AuthWithPrivateKey,
	network: FlowNetwork,
	collection: FlowContractAddress,
): Promise<FlowTransaction> {
	if (!fcl) {
		throw new Error("Fcl is required for setup collection on account")
	}
	const { map, name } = getCollectionConfig(
		network,
		collection,
	)
	if (isWhitelabelCollection(name)) {
		const txId = await runTransaction(
			fcl,
			map,
			getWhitelabelOrderCode(fcl, name).setupAccount(),
			auth,
		)
		return waitForSeal(fcl, txId)
	}

	const txId = await runTransaction(
		fcl,
		map,
		getNftCode(name).setupAccount(),
		auth,
	)
	return waitForSeal(fcl, txId)
}

export async function setupVault(
	fcl: Maybe<Fcl>,
	auth: AuthWithPrivateKey,
	network: FlowNetwork,
): Promise<FlowTransaction> {
	if (!fcl) {
		throw new Error("Fcl is required for setup collection on account")
	}
	const map = CONFIGS[network].mainAddressMap
	const txId = await runTransaction(
		fcl,
		map,
		{
			cadence: txInitVault,
			args: fcl.args([]),
		},
		auth,
	)
	return waitForSeal(fcl, txId)
}
