import { getCollectionConfig, Networks, runTransaction, waitForSeal } from "@rarible/flow-sdk-scripts"

export async function transfer(network: Networks, collection: string, tokenId: number, to: string): Promise<string> {
	const { addressMap, collectionConfig } = getCollectionConfig(network, collection)
	if (collectionConfig.mintable) {
		const txId = await runTransaction(addressMap, collectionConfig.transactions.nft.transfer(tokenId, to))
		await waitForSeal(txId)
		return txId
	} else {
		throw Error("This collection doesn't support 'transfer'")
	}
}
