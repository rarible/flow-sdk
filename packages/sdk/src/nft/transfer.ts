import type { Fcl } from "@rarible/fcl-types"
import type { Maybe } from "@rarible/types/build/maybe"
import type { FlowContractAddress } from "@rarible/types"
import type { AuthWithPrivateKey, FlowNetwork, FlowTransaction } from "../types"
import { runScript, runTransaction, waitForSeal } from "../common/transaction"
import { getNftCode } from "../tx-code-store/nft"
import { getCollectionConfig } from "../common/collection/get-config"

export async function transfer(
	fcl: Maybe<Fcl>,
	auth: AuthWithPrivateKey,
	network: FlowNetwork,
	collection: FlowContractAddress,
	tokenId: number,
	to: string,
): Promise<FlowTransaction> {
	if (fcl) {
		const { map, name } = getCollectionConfig(network, collection)
		const checkReceiver = await runScript(fcl, getNftCode(name).check(fcl, to), map)
		if (checkReceiver) {
			const txId = await runTransaction(fcl, map, getNftCode(name).transfer(fcl, tokenId, to), auth)
			return await waitForSeal(fcl, txId)
		}
		throw new Error("The recipient has't yet initialized this collection on their account, and can't receive NFT from this collection")
	}
	throw new Error("Fcl is required for transfer")
}
