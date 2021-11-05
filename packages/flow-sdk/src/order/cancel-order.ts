import type { Fcl } from "@rarible/fcl-types"
import type { Networks } from "../config"
import { runTransaction, waitForSeal } from "../common/transaction"
import { getCollectionConfig } from "../common/get-collection-config"
import { getOrderCode } from "../txCodeStore/order"
import type { AuthWithPrivateKey } from "../types"

export async function cancelOrder(
	fcl: Fcl,
	auth: AuthWithPrivateKey,
	network: Networks,
	collection: string,
	orderId: number
) {
	const { collectionName, addressMap } = getCollectionConfig(network, collection)
	const txId = await runTransaction(
		fcl,
		addressMap,
		getOrderCode(collectionName).cancelOrder(fcl, orderId),
		auth,
	)
	return await waitForSeal(fcl, txId)
}
