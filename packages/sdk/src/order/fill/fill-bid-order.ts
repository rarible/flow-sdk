import type { Fcl } from "@rarible/fcl-types"
import type { FlowAddress } from "@rarible/types"
import type { AuthWithPrivateKey, FlowCurrency, FlowFee, FlowTransaction, NonFungibleContract } from "../../types"
import { runTransaction, waitForSeal } from "../../common/transaction"
import { getBidCode } from "../../tx-code-store/order/rarible-open-bid"
import {getOrderId} from "../common/get-order-id"

export async function fillBidOrder(
	fcl: Fcl,
	auth: AuthWithPrivateKey,
	currency: FlowCurrency,
	name: NonFungibleContract,
	map: Record<string, string>,
	orderId: number,
	owner: FlowAddress,
	fees: FlowFee[],
): Promise<FlowTransaction> {
	const preparedOrderId = getOrderId(orderId)
	const txId = await runTransaction(
		fcl,
		map,
		getBidCode(fcl, name).close(currency, preparedOrderId, owner, fees),
		auth,
	)
	return waitForSeal(fcl, txId)
}
