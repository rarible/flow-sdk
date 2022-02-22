import type { Maybe } from "@rarible/types/build/maybe"
import type { Fcl } from "@rarible/fcl-types"
import type { AuthWithPrivateKey, FlowNetwork, FlowTransaction } from "../../types"
import { runTransaction, waitForSeal } from "../../common/transaction"
import { getNftCode } from "../../blockchain-api/nft"
import type { FlowContractAddress } from "../../types/contract-address"
import { getCollectionConfig } from "../../config/utils"

export async function burn(
	fcl: Maybe<Fcl>,
	auth: AuthWithPrivateKey,
	network: FlowNetwork,
	collection: FlowContractAddress,
	tokenId: number,
): Promise<FlowTransaction> {
	if (fcl) {
		const { features, map, name } = getCollectionConfig(network, collection)
		if (features.includes("BURN")) {
			const txId = await runTransaction(fcl, map, getNftCode(name).burn(fcl, tokenId), auth)
			return waitForSeal(fcl, txId)
		}
		throw new Error("This collection doesn't support 'burn' action")
	}
	throw new Error("Fcl is required for burn")
}
