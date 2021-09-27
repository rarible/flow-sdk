import { getCollectionConfig, Networks, runTransaction, waitForSeal } from "@rarible/flow-sdk-scripts"

export async function burn(network: Networks, collection: string, tokenId: number): Promise<string> {
	const { addressMap, collectionConfig } = getCollectionConfig(network, collection)
	if (collectionConfig.mintable) {
		const txId = await runTransaction(network, addressMap, collectionConfig.transactions.nft.burn(tokenId))
		await waitForSeal(txId)
		return txId
	} else {
		throw Error("This collection doesn't support 'burn'")
	}
}
