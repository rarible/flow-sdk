import type { Fcl } from "@rarible/fcl-types"
import type { Maybe } from "@rarible/types/build/maybe"
import type { AuthWithPrivateKey, FlowNetwork, FlowTransaction } from "../../types"
import { runTransaction, waitForSeal } from "../../common/transaction"
import { getNftCode } from "../../blockchain-api/nft"
import type { FlowContractAddress } from "../../types/contract-address"
import { getCollectionConfig } from "../../config/utils"

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
	const txId = await runTransaction(
		fcl,
		map,
		getNftCode(name).setupAccount(),
		auth,
	)
	return waitForSeal(fcl, txId)
}
