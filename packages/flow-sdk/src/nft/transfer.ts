import { getCollectionConfig, Networks, runTransaction, waitForSeal } from "@rarible/flow-sdk-scripts"

export async function transfer(network: Networks, collection: string, tokenId: number, to: string) {
	const { addressMap, collectionConfig } = getCollectionConfig(network, collection)
	if (collectionConfig.mintable) {
		const txId = await runTransaction(network, addressMap, collectionConfig.transactions.nft.transfer(tokenId, to))
		return await waitForSeal(txId)
	} else {
		throw Error("This collection doesn't support 'transfer'")
	}
}
