import { Fcl } from "@rarible/fcl-types"
import { Networks } from "../config"
import { runTransaction, waitForSeal } from "../common/transaction"
import { getNftCode } from "../txCodeStore/ntf"
import { getCollectionConfig } from "../common/get-collection-config"

export async function transfer(fcl: Fcl, network: Networks, collection: string, tokenId: number, to: string) {
	const { addressMap, collectionConfig, collectionName } = getCollectionConfig(network, collection)
	if (collectionConfig.mintable) {
		const txId = await runTransaction(fcl, addressMap, getNftCode(collectionName).transfer(fcl, tokenId, to))
		return await waitForSeal(fcl, txId)
	} else {
		throw Error("This collection doesn't support 'transfer'")
	}
}
