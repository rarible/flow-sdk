import type { Fcl } from "@rarible/fcl-types"
import type { Networks } from "../config"
import { runTransaction, waitForSeal } from "../common/transaction"
import { getNftCode } from "../txCodeStore/ntf"
import { getCollectionConfig } from "../common/get-collection-config"
import type { AuthWithPrivateKey } from "../types"

export async function burn(fcl: Fcl, auth: AuthWithPrivateKey, network: Networks, collection: string, tokenId: number) {
	const { addressMap, collectionName } = getCollectionConfig(network, collection)
	const txId = await runTransaction(fcl, addressMap, getNftCode(collectionName).burn(fcl, tokenId), auth)
	return await waitForSeal(fcl, txId)
}
