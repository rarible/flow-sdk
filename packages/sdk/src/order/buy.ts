import type { Fcl } from "@rarible/fcl-types"
import type { FlowNetwork, FlowTransaction } from "../types"
import { runTransaction, waitForSeal } from "../common/transaction"
import { getOrderCode } from "../tx-code-store/order"
import type { AuthWithPrivateKey, FlowCurrency } from "../types"
import { getCollectionConfig } from "../common/collection/get-config"
import type { FlowContractAddress } from "../common/flow-address"

export async function buy(
	fcl: Fcl,
	auth: AuthWithPrivateKey,
	network: FlowNetwork,
	collection: FlowContractAddress,
	currency: FlowCurrency,
	orderId: number,
	owner: string,
): Promise<FlowTransaction> {
	const { name, map } = getCollectionConfig(network, collection)
	const txId = await runTransaction(
		fcl,
		map,
		getOrderCode(name).buy(fcl, currency, orderId, owner),
		auth,
	)
	return waitForSeal(fcl, txId)
}
