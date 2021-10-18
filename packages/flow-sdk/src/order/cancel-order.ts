import { Fcl } from "@rarible/fcl-types"
import { getCollectionConfig, Networks } from "../config"
import { runTransaction, waitForSeal } from "../common/transaction"

export async function cancelOrder(fcl: Fcl, network: Networks, collection: string, orderId: number) {
	const { addressMap, collectionConfig, collectionAddress } = getCollectionConfig(network, collection)
	switch (collection) {
		case `A.${collectionAddress}.CommonNFT.NFT`: {
			if (collectionConfig.mintable) {
				const txId = await runTransaction(
					fcl,
					addressMap,
					collectionConfig.transactions.order.removeOrder(fcl, orderId)
				)
				return await waitForSeal(fcl, txId)
			} else {
				throw Error("This collection doesn't support order canceling")
			}
		}
		default: {
			throw Error("Wrong collection")
		}
	}
}
