import type { Fcl } from "@rarible/fcl-types"
import type { Maybe } from "@rarible/types/build/maybe"
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
import type { FlowItemId } from "../common/item"
import { extractTokenId } from "../common/item"
import { retry } from "../common/retry"
import type { FlowContractAddress } from "../common/flow-address"
import { getOrderCode } from "../tx-code-store/order/storefront"
import { fixAmount } from "../common/fix-amount"
import { getAccountAddress } from "../common/get-account-address"
import { getProtocolFee } from "./get-protocol-fee"
import { calculateSaleCuts } from "./common/calculate-sale-cuts"

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
		const from = await getAccountAddress(fcl, auth)

		// condition only for tests on local emulator
		const item = network === "emulator" ?
			{ royalties: [] } :
			await retry(10, 1000, async () => itemApi.getNftItemById({ itemId }))
		const { name, map } = getCollectionConfig(network, collection)
		const txId = await runTransaction(
			fcl,
			map,
			getOrderCode(fcl, name).create(
				currency,
				extractTokenId(itemId),
				calculateSaleCuts(
					from,
					fixAmount(sellItemPrice),
					[
						getProtocolFee.percents(network).sellerFee,
						...(originFees || []),
						...(item.royalties || []),
					],
					[...(payouts || [])],
				),
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
