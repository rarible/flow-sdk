import { getCollectionConfig, Networks, Royalty, runTransaction, waitForSeal } from "@rarible/flow-sdk-scripts"

export async function mint(
	network: Networks, collection: string, metadata: string, royalties: Royalty[],
) {
	const { addressMap, collectionAddress, collectionConfig } = getCollectionConfig(network, collection)
	if (collectionConfig.mintable) {
		const txId = await runTransaction(
			addressMap, collectionConfig.transactions.nft.mint(collectionAddress, metadata, royalties),
		)
		return await waitForSeal(txId)
	} else {
		throw Error("This collection doesn't support 'mint'")
	}
}
