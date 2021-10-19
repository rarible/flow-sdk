import { Fcl } from "@rarible/fcl-types"
import { getCollectionConfig, Networks } from "../config"
import { runTransaction, waitForSeal } from "../common/transaction"

export async function buy(fcl: Fcl, network: Networks, collection: string, orderId: number, owner: string) {
	const { addressMap, collectionConfig } = getCollectionConfig(network, collection)
	const txId = await runTransaction(fcl, addressMap, collectionConfig.transactions.order.buy(fcl, orderId, owner))
	return await waitForSeal(fcl, txId)
}
