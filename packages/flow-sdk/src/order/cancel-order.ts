import { Fcl } from "@rarible/fcl-types"
import { CommonNftOrder } from "@rarible/flow-sdk-scripts"
import { Networks } from "../config"
import { runTransaction, waitForSeal } from "../common/transaction"
import { getCollectionConfig } from "../common/get-collection-config"

export async function cancelOrder(fcl: Fcl, network: Networks, collection: string, orderId: number) {
	const { collectionName, addressMap, collectionConfig } = getCollectionConfig(network, collection)
	switch (collectionName) {
		case "CommonNFT":
		case "Rarible": {
			if (collectionConfig.mintable) {
				const txId = await runTransaction(
					fcl,
					addressMap,
					CommonNftOrder.removeOrder(fcl, orderId),
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
