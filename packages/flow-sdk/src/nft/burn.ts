import { getCollectionConfig, Networks, runTransaction, waitForSeal } from "@rarible/flow-sdk-scripts"

export async function burn(network: Networks, collection: string, tokenId: number) {
	const { addressMap, collectionConfig } = getCollectionConfig(network, collection)
	if (collectionConfig.mintable) {
		const txId = await runTransaction(network, addressMap, collectionConfig.transactions.nft.burn(tokenId))
		return await waitForSeal(txId)
	} else {
		throw Error("This collection doesn't support 'burn'")
	}
}
