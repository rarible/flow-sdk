import type { Fcl } from "@rarible/fcl-types"
import type { Maybe } from "@rarible/types/build/maybe"
import type { AuthWithPrivateKey, FlowNetwork, FlowTransaction } from "../types"
import { runTransaction, waitForSeal } from "../common/transaction"
import { getCollectionConfig } from "../common/collection/get-config"
import type { FlowContractAddress } from "../common/flow-address"
import { getOrderCode } from "../tx-code-store/order/storefront"
import {getMattelOrderCode, isMattelCollection} from "../tx-code-store/order/mattel-storefront"
import {getOrderId} from "./common/get-order-id"

export async function cancelOrder(
	fcl: Maybe<Fcl>,
	auth: AuthWithPrivateKey,
	network: FlowNetwork,
	collection: FlowContractAddress,
	orderId: string | number,
): Promise<FlowTransaction> {
	if (fcl) {
		const { name, map } = getCollectionConfig(network, collection)

		const preparedOrderId = getOrderId(orderId)
		if (isMattelCollection(name)) {
			const txId = await runTransaction(
				fcl,
				map,
				getMattelOrderCode(fcl, name).cancel(preparedOrderId),
				auth
			)
			return waitForSeal(fcl, txId)
		}

		const txId = await runTransaction(
			fcl,
			map,
			getOrderCode(fcl, name).cancel(preparedOrderId),
			auth,
		)
		return waitForSeal(fcl, txId)
	}
	throw new Error("Fcl is required for cancelling order")
}
