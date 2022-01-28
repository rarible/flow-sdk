import type { Fcl } from "@rarible/fcl-types"
import type { FlowAddress } from "@rarible/types"
import type { AuthWithPrivateKey, FlowCurrency, FlowFee, FlowTransaction } from "../../types"
import { runTransaction, waitForSeal } from "../../common/transaction"
import type { FlowCollectionName } from "../../common/collection"
import { getBidCode } from "../../tx-code-store/order/rarible-open-bid"

export async function fillBidOrder(
	fcl: Fcl,
	auth: AuthWithPrivateKey,
	currency: FlowCurrency,
	name: FlowCollectionName,
	map: Record<string, string>,
	orderId: number,
	owner: FlowAddress,
	fees: FlowFee[],
): Promise<FlowTransaction> {
	const txId = await runTransaction(
		fcl,
		map,
		getBidCode(fcl, name).close(currency, orderId, owner, fees),
		auth,
	)
	return waitForSeal(fcl, txId)
}
