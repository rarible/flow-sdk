import { Fcl } from "@rarible/fcl-types"
import { Networks } from "../config"
import { runTransaction, waitForSeal } from "../common/transaction"
import { getOrderCode } from "../txCodeStore/order"
import { AuthWithPrivateKey, Currency } from "../types"
import { getCollectionConfig } from "../common/get-collection-config"

export async function sell(
	fcl: Fcl,
	auth: AuthWithPrivateKey,
	network:
	Networks,
	collection: string,
	currency: Currency,
	sellItemId: number,
	sellItemPrice: string,
) {
	const { collectionName, addressMap } = getCollectionConfig(network, collection)
	const txId = await runTransaction(
		fcl,
		addressMap,
		getOrderCode(collectionName).sell(fcl, currency, sellItemId, sellItemPrice),
		auth,
	)
	return await waitForSeal(fcl, txId)
}
