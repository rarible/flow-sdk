import type { Fcl } from "@rarible/fcl-types"
import type { Networks } from "../config"
import { runTransaction, waitForSeal } from "../common/transaction"
import { getOrderCode } from "../txCodeStore/order"
import type { AuthWithPrivateKey, Currency } from "../types"
import { getCollectionConfig } from "../common/get-collection-config"
import { fixAmount } from "../common/utils"

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
		getOrderCode(collectionName).sell(fcl, currency, sellItemId, fixAmount(sellItemPrice)),
		auth,
	)
	return await waitForSeal(fcl, txId)
}
