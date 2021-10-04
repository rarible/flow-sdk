import { getCollectionConfig, Networks, runTransaction, waitForSeal } from "@rarible/flow-sdk-scripts"

export async function cancelOrder(network: Networks, collection: string, orderId: number) {
	const { addressMap, collectionConfig, collectionAddress } = getCollectionConfig(network, collection)
	switch (collection) {
		case `A.${collectionAddress}.CommonNFT.NFT`: {
			if (collectionConfig.mintable) {
				const txId = await runTransaction(network, addressMap, collectionConfig.transactions.order.removeOrder(orderId))
				return await waitForSeal(txId)
			} else {
				throw Error("This collection doesn't support order canceling")
			}
		}
		default: {
			throw Error("Wrong collection")
		}
	}
}
