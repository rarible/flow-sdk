import type { Fcl } from "@rarible/fcl-types"
import type { Maybe } from "@rarible/types/build/maybe"
import { txInitNFTContractsAndStorefrontV2 } from "@rarible/flow-sdk-scripts/build/cadence/nft/mattel-contracts-orders"
import type { AuthWithPrivateKey, FlowNetwork, FlowTransaction } from "../types"
import type { FlowContractAddress } from "../common/flow-address"
import { runTransaction, waitForSeal } from "../common/transaction"
import { getNftCode } from "../tx-code-store/nft"
import { getCollectionConfig } from "../common/collection/get-config"

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
	if (name === "HWGarageCard" || name === "HWGaragePack") {
		const txId = await runTransaction(
			fcl,
			map,
			{
				cadence: txInitNFTContractsAndStorefrontV2,
				args: fcl.args([]),
			},
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
