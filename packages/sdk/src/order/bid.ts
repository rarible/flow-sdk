import type { Fcl } from "@rarible/fcl-types"
import type { Maybe } from "@rarible/types/build/maybe"
import type { BigNumber } from "@rarible/types"
import type { AuthWithPrivateKey, FlowCurrency, FlowFee, FlowNetwork, FlowOriginFees } from "../types"
import { runTransaction, waitForSeal } from "../common/transaction"
import { getCollectionConfig } from "../common/collection/get-config"
import { getBidCode } from "../tx-code-store/order/rarible-open-bid"
import { parseEvents } from "../common/parse-tx-events"
import type { FlowItemId } from "../common/item"
import { extractTokenId } from "../common/item"
import { calculateFees } from "../common/calculate-fees"
import type { FlowContractAddress } from "../common/flow-address"
import { fixAmount } from "../common/fix-amount"
import { getProtocolFee } from "./get-protocol-fee"
import type { FlowSellResponse } from "./sell"

export async function bid(
	fcl: Maybe<Fcl>,
	auth: AuthWithPrivateKey,
	network: FlowNetwork,
	collection: FlowContractAddress,
	currency: FlowCurrency,
	itemId: FlowItemId,
	price: BigNumber,
	originFee?: FlowOriginFees,
): Promise<FlowSellResponse> {
	if (fcl) {
		const { name, map } = getCollectionConfig(network, collection)
		const protocolFees: FlowFee[] = [getProtocolFee.percents(network).buyerFee]
		const requestFees: FlowFee[] = originFee || []
		const txId = await runTransaction(
			fcl,
			map,
			getBidCode(fcl, name).create(
				currency,
				extractTokenId(itemId),
				fixAmount(price),
				[
					...calculateFees(price, protocolFees),
					...calculateFees(price, requestFees),
				],
			),
			auth,
		)
		const txResponse = await waitForSeal(fcl, txId)
		const simpleOrderId = parseEvents<string>(txResponse.events, "BidAvailable", "bidId")
		return {
			...txResponse,
			orderId: parseInt(simpleOrderId),
		}
	}
	throw new Error("Fcl is required for purchasing")
}
