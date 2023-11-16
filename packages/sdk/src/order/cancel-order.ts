import type { Fcl } from "@rarible/fcl-types"
import type { Maybe } from "@rarible/types/build/maybe"
import type { AuthWithPrivateKey, FlowNetwork, FlowTransaction } from "../types"
import { runTransaction, waitForSeal } from "../common/transaction"
import { getCollectionConfig } from "../common/collection/get-config"
import type { FlowContractAddress } from "../common/flow-address"
import { getOrderCode } from "../tx-code-store/order/storefront"
import {getWhitelabelOrderCode, isWhitelabelCollection} from "../tx-code-store/order/whitelabel-storefront"
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
		if (isWhitelabelCollection(name)) {
			const txId = await runTransaction(
				fcl,
				map,
				getWhitelabelOrderCode(fcl, name).cancel(preparedOrderId),
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
