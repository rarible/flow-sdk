import type { Fcl } from "@rarible/fcl-types"
import type { FlowNetwork, FlowTransaction } from "../types"
import { runTransaction, waitForSeal } from "../common/transaction"
import { getOrderCode } from "../tx-code-store/order"
import type { AuthWithPrivateKey } from "../types"
import { getCollectionConfig } from "../common/collection/get-config"
import type { FlowContractAddress } from "../common/flow-address"

export async function cancelOrder(
	fcl: Fcl,
	auth: AuthWithPrivateKey,
	network: FlowNetwork,
	collection: FlowContractAddress,
	orderId: number
): Promise<FlowTransaction> {
	const { name, map } = getCollectionConfig(network, collection)
	const txId = await runTransaction(
		fcl,
		map,
		getOrderCode(name).cancelOrder(fcl, orderId),
		auth,
	)
	return waitForSeal(fcl, txId)
}
