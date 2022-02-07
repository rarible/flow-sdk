import type { Fcl } from "@rarible/fcl-types"
import type { Maybe } from "@rarible/types/build/maybe"
import type { AuthWithPrivateKey, FlowNetwork, FlowTransaction } from "../../types/types"
import { runTransaction, waitForSeal } from "../../common/transaction"
import { getOrderCode } from "../../blockchain-api/order/storefront"
import type { FlowContractAddress } from "../../types/contract-address"
import { getCollectionConfig } from "../../config/utils"

export async function cancelOrder(
	fcl: Maybe<Fcl>,
	auth: AuthWithPrivateKey,
	network: FlowNetwork,
	collection: FlowContractAddress,
	orderId: number,
): Promise<FlowTransaction> {
	if (fcl) {
		const { name, map } = getCollectionConfig(network, collection)
		const txId = await runTransaction(
			fcl,
			map,
			getOrderCode(fcl, name).cancel(orderId),
			auth,
		)
		return waitForSeal(fcl, txId)
	}
	throw new Error("Fcl is required for cancelling order")
}
