import type { Fcl } from "@rarible/fcl-types"
import type { Maybe } from "@rarible/types/build/maybe"
import { toFlowAddress } from "@rarible/types"
import type { FlowNftItemControllerApi } from "@rarible/flow-api-client"
import type {
	AuthWithPrivateKey,
	FlowCurrency,
	FlowNetwork,
	FlowOriginFees,
	FlowPayouts,
	FlowTransaction,
} from "../../types/types"
import { runTransaction, waitForSeal } from "../../common/transaction"
import { parseEvents } from "../../common/parse-tx-events"
import type { FlowItemId } from "../../types/item"
import { extractTokenId } from "../../types/item"
import { retry } from "../../common/retry"
import { getOrderCode } from "../../blockchain-api/order/storefront"
import { fixAmount } from "../../common/fix-amount"
import type { FlowContractAddress } from "../../types/contract-address"
import { getCollectionConfig } from "../../config/utils"
import { checkPrice } from "./common/check-price"
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
		const from = auth ? toFlowAddress((await auth()).addr) : toFlowAddress((await fcl.currentUser().snapshot()).addr!)
		if (!from) {
			throw new Error("FLOW-SDK: Can't get current user address")
		}
		// condition only for tests on local emulator
		const item = network === "emulator" ?
			{ royalties: [] } :
			{ royalties: (await retry(10, 1000, async () => itemApi.getNftItemRoyaltyById({ itemId }))).royalty }
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
