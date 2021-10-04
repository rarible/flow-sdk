import { getCollectionConfig, Networks, runTransaction, waitForSeal } from "@rarible/flow-sdk-scripts"

export async function buy(network: Networks, collection: string, orderId: number, owner: string) {
	const { addressMap, collectionConfig } = getCollectionConfig(network, collection)
	const txId = await runTransaction(network, addressMap, collectionConfig.transactions.order.buy(orderId, owner))
	return await waitForSeal(txId)
}
