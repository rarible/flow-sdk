import { getCollectionConfig, Networks, Royalty, runTransaction, waitForSeal } from "@rarible/flow-sdk-scripts"

export async function mint(
	network: Networks, collection: string, metadata: string, royalties: Royalty[],
): Promise<number> {
	const { addressMap, collectionAddress, collectionConfig } = getCollectionConfig(network, collection)
	if (collectionConfig.mintable) {
		const txId = await runTransaction(
			addressMap, collectionConfig.transactions.nft.mint(collectionAddress, metadata, royalties),
		)
		const txResult = await waitForSeal(txId)
		if (txResult.events.length) {
			return txResult.events[0].data.id
		} else {
			throw Error("Something went wrong, transaction sent but events is empty")
		}
	} else {
		throw Error("This collection doesn't support 'mint'")
	}
}
