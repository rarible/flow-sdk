import type { Fcl } from "@rarible/fcl-types"
import type { AuthWithPrivateKey, FlowNetwork } from "../types"
import { runTransaction, waitForSeal } from "../common/transaction"
import { getNftCode } from "../tx-code-store/nft"
import type { FlowContractAddress } from "../common/flow-address"
import { getCollectionConfig } from "../common/collection/get-config"

export async function transfer(
	fcl: Fcl,
	auth: AuthWithPrivateKey,
	network: FlowNetwork,
	collection: FlowContractAddress,
	tokenId: number,
	to: string,
) {
	const { map, name } = getCollectionConfig(network, collection)
	const txId = await runTransaction(fcl, map, getNftCode(name).transfer(fcl, tokenId, to), auth)
	return await waitForSeal(fcl, txId)
}
