import type { Fcl } from "@rarible/fcl-types"
import type { Networks } from "../config"
import { runTransaction, waitForSeal } from "../common/transaction"
import { getOrderCode } from "../txCodeStore/order"
import type { AuthWithPrivateKey, Currency } from "../types"
import { getCollectionConfig } from "../common/get-collection-config"

export async function buy(
	fcl: Fcl,
	auth: AuthWithPrivateKey,
	network: Networks,
	collection: string,
	currency: Currency,
	orderId: number,
	owner: string,
) {
	const { collectionName, addressMap } = getCollectionConfig(network, collection)
	const txId = await runTransaction(
		fcl,
		addressMap,
		getOrderCode(collectionName).buy(fcl, currency, orderId, owner),
		auth,
	)
	return await waitForSeal(fcl, txId)
}
