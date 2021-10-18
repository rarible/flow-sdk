import { Fcl } from "@rarible/fcl-types"
import { getCollectionConfig, Networks } from "../config"
import { runTransaction, waitForSeal } from "../common/transaction"

export async function burn(fcl: Fcl, network: Networks, collection: string, tokenId: number) {
	const { addressMap, collectionConfig } = getCollectionConfig(network, collection)
	if (collectionConfig.mintable) {
		const txId = await runTransaction(fcl, addressMap, collectionConfig.transactions.nft.burn(fcl, tokenId))
		return await waitForSeal(fcl, txId)
	} else {
		throw Error("This collection doesn't support 'burn'")
	}
}
