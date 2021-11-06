import type { Fcl } from "@rarible/fcl-types"
import type { FlowNetwork } from "../types"
import { runTransaction, waitForSeal } from "../common/transaction"
import { getNftCode } from "../tx-code-store/ntf"
import type { AuthWithPrivateKey } from "../types"
import type { FlowContractAddress } from "../common/flow-address"
import { getCollectionConfig } from "../common/collection/get-config"

export async function burn(
	fcl: Fcl,
	auth: AuthWithPrivateKey,
	network: FlowNetwork,
	collection: FlowContractAddress,
	tokenId: number
) {
	const { map, config, name } = getCollectionConfig(network, collection)
	if (config.mintable) {
		const txId = await runTransaction(fcl, map, getNftCode(name).burn(fcl, tokenId), auth)
		return await waitForSeal(fcl, txId)
	} else {
		throw new Error("This collection doesn't support 'burn'")
	}
}
