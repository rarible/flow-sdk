import type { Fcl } from "@rarible/fcl-types"
import type { Maybe } from "@rarible/types/build/maybe"
import { toBigNumber, toFlowAddress } from "@rarible/types"
import type { FlowNftItemControllerApi } from "@rarible/flow-api-client"
import type {
	AuthWithPrivateKey,
	FlowCurrency,
	FlowNetwork,
	FlowOriginFees,
	FlowPayouts,
	FlowTransaction,
} from "../types"
import { runTransaction, waitForSeal } from "../common/transaction"
import { getCollectionConfig } from "../common/collection/get-config"
import { checkPrice } from "../common/check-price"
import { parseEvents } from "../common/parse-tx-events"
import { getOrderCode } from "../tx-code-store/order"
import type { FlowItemId } from "../common/item"
import { extractTokenId } from "../common/item"
import { retry } from "../common/retry"
import type { FlowContractAddress } from "../common/flow-address"
import { getProtocolFee } from "./get-protocol-fee"

export type FlowSellRequest = {
	collection: FlowContractAddress,
	currency: FlowCurrency,
	itemId: FlowItemId,
	sellItemPrice: string,
	originFees?: FlowOriginFees,
	payouts?: FlowPayouts,
}

export interface FlowSellResponse extends FlowTransaction {
	orderId: number
}

export async function sell(
	fcl: Maybe<Fcl>,
	itemApi: FlowNftItemControllerApi,
	auth: AuthWithPrivateKey,
	network: FlowNetwork,
	request: FlowSellRequest,
): Promise<FlowSellResponse> {
	const { collection, currency, itemId, sellItemPrice, payouts, originFees } = request
	checkPrice(sellItemPrice)
	if (fcl) {
		const from = auth ? toFlowAddress((await auth()).addr) : toFlowAddress((await fcl.currentUser().snapshot()).addr!)
		if (!from) {
			throw new Error("FLOW-SDK: Can't get current user address")
		}
		// condition only for tests on local emulator
		const item = network === "emulator" ? { royalties: [] } : await retry(10, 1000, async () => itemApi.getNftItemById({ itemId }))
		const { name, map } = getCollectionConfig(network, collection)
		// must be 100% to seller address by default(if not defined)
		const preparePayouts = !!payouts && payouts.length ? payouts : [{ account: from, value: toBigNumber("1.0") }]
		// todo check fees summ
		const txId = await runTransaction(
			fcl,
			map,
			getOrderCode(fcl, name).sell(
				currency,
				extractTokenId(itemId),
				sellItemPrice,
				[...originFees || [], getProtocolFee.percents(network).sellerFee],
				item.royalties,
				preparePayouts,
			),
			auth,
		)
		const tx = await waitForSeal(fcl, txId)
		const simpleOrderId = parseEvents<string>(tx.events, "ListingAvailable", "listingResourceID")
		return {
			...tx,
			orderId: parseInt(simpleOrderId),
		}
	}
	throw new Error("Fcl is required for creating order")
}
