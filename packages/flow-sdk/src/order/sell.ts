import { Fcl } from "@rarible/fcl-types"
import { getCollectionConfig, Networks } from "../config"
import { runTransaction, waitForSeal } from "../common/transaction"

export async function sell(fcl: Fcl, network: Networks, collection: string, sellItemId: number, sellItemPrice: string) {
	const { addressMap, collectionConfig } = getCollectionConfig(network, collection)
	const txId = await runTransaction(
		fcl,
		addressMap,
		collectionConfig.transactions.order.sell(fcl, sellItemId, sellItemPrice),
	)
	return await waitForSeal(fcl, txId)
}
