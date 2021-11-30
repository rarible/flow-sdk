import type { Maybe } from "@rarible/types/build/maybe"
import type { Fcl } from "@rarible/fcl-types"
import type { FlowContractAddress } from "@rarible/types"
import type { AuthWithPrivateKey, FlowNetwork, FlowTransaction } from "../types"
import { runTransaction, waitForSeal } from "../common/transaction"
import { getNftCode } from "../tx-code-store/nft"
import { getCollectionConfig } from "../common/collection/get-config"

export async function burn(
	fcl: Maybe<Fcl>,
	auth: AuthWithPrivateKey,
	network: FlowNetwork,
	collection: FlowContractAddress,
	tokenId: number,
): Promise<FlowTransaction> {
	if (fcl) {
		const { map, name } = getCollectionConfig(network, collection)
		const txId = await runTransaction(fcl, map, getNftCode(name).burn(fcl, tokenId), auth)
		return waitForSeal(fcl, txId)
	}
	throw new Error("Fcl is required for mint")
}
