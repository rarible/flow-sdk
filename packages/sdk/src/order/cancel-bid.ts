import type { Fcl } from "@rarible/fcl-types"
import type { FlowContractAddress, Maybe } from "@rarible/types"
import type { AuthWithPrivateKey, FlowNetwork, FlowTransaction } from "../types"
import { runTransaction, waitForSeal } from "../common/transaction"
import { getCollectionConfig } from "../common/collection/get-config"
import { getBidCode } from "../tx-code-store/order/rarible-open-bid"

export async function cancelBid(
	fcl: Maybe<Fcl>,
	auth: AuthWithPrivateKey,
	network: FlowNetwork,
	collection: FlowContractAddress,
	orderId: string | number,
): Promise<FlowTransaction> {
	if (fcl) {
		const { name, map } = getCollectionConfig(network, collection)
		const txId = await runTransaction(
			fcl,
			map,
			getBidCode(fcl, name).cancel(orderId),
			auth,
		)
		return waitForSeal(fcl, txId)
	}
	throw new Error("Fcl is required for cancelling order")
}
