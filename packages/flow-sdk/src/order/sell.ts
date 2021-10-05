import { getCollectionConfig, Networks, runTransaction, waitForSeal } from "@rarible/flow-sdk-scripts"

export async function sell(network: Networks, collection: string, sellItemId: number, sellItemPrice: string) {
	const { addressMap, collectionConfig } = getCollectionConfig(network, collection)
	const txId = await runTransaction(addressMap, collectionConfig.transactions.order.sell(sellItemId, sellItemPrice))
	await waitForSeal(txId)
	return txId
}
