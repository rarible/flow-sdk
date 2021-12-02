import type { Fcl } from "@rarible/fcl-types"
import type { Maybe } from "@rarible/types/build/maybe"
import type { FlowContractAddress } from "@rarible/types"
import type { AuthWithPrivateKey, FlowCurrency, FlowNetwork, FlowOriginFees, FlowTransaction } from "../types"
import { runTransaction, waitForSeal } from "../common/transaction"
import { getOrderCode } from "../tx-code-store/order"
import { getCollectionConfig } from "../common/collection/get-config"

export async function buy(
	fcl: Maybe<Fcl>,
	auth: AuthWithPrivateKey,
	network: FlowNetwork,
	collection: FlowContractAddress,
	currency: FlowCurrency,
	orderId: number,
	owner: string,
	fees: FlowOriginFees,
): Promise<FlowTransaction> {
	if (fcl) {
		const { name, map } = getCollectionConfig(network, collection)
		const txId = await runTransaction(
			fcl,
			map,
			getOrderCode(fcl, name).buy(currency, orderId, owner, fees),
			auth,
		)
		return waitForSeal(fcl, txId)
	}
	throw new Error("Fcl is required for purchasing")
}
