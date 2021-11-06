import type { Fcl } from "@rarible/fcl-types"
import type { FlowNetwork } from "../types"
import { runTransaction, waitForSeal } from "../common/transaction"
import { getOrderCode } from "../tx-code-store/order"
import type { AuthWithPrivateKey, FlowCurrency } from "../types"
import { fixAmount } from "../common/fix-amount"
import type { FlowContractAddress } from "../common/flow-address"
import { getCollectionConfig } from "../common/collection/get-config"

export async function sell(
	fcl: Fcl,
	auth: AuthWithPrivateKey,
	network: FlowNetwork,
	collection: FlowContractAddress,
	currency: FlowCurrency,
	sellItemId: number,
	sellItemPrice: string,
) {
	const { name, map } = getCollectionConfig(network, collection)
	const txId = await runTransaction(
		fcl,
		map,
		getOrderCode(name).sell(fcl, currency, sellItemId, fixAmount(sellItemPrice)),
		auth,
	)
	return await waitForSeal(fcl, txId)
}
