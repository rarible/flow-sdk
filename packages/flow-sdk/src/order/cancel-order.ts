import { Fcl } from "@rarible/fcl-types"
import { Networks } from "../config"
import { runTransaction, waitForSeal } from "../common/transaction"
import { getCollectionConfig } from "../common/get-collection-config"
import { getOrderCode } from "../txCodeStore/order"

export async function cancelOrder(fcl: Fcl, network: Networks, collection: string, orderId: number) {
	const { collectionName, addressMap } = getCollectionConfig(network, collection)
	const txId = await runTransaction(
		fcl,
		addressMap,
		getOrderCode(collectionName).cancelOrder(fcl, orderId),
	)
	return await waitForSeal(fcl, txId)
}
