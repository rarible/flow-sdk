import type { FlowContractAddress, Maybe } from "@rarible/types"
import type { Fcl } from "@rarible/fcl-types"
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
		const { config, map, name } = getCollectionConfig(network, collection)
		if (config.features.includes("BURN")) {
			const txId = await runTransaction(fcl, map, getNftCode(name).burn(fcl, tokenId), auth)
			return waitForSeal(fcl, txId)
		}
		throw new Error("This collection doesn't support 'burn' action")
	}
	throw new Error("Fcl is required for burn")
}
