import type { Fcl } from "@rarible/fcl-types"
import type { Maybe } from "@rarible/types/build/maybe"
import { toFlowAddress } from "@rarible/types"
import type { FlowNftItemControllerApi } from "@rarible/flow-api-client"
import {
	txInitNFTContractsAndStorefrontV2,
} from "@rarible/flow-sdk-scripts/build/cadence/nft/mattel-contracts-orders"
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
import type { FlowContractAddress } from "../common/flow-address"
import { getOrderCode } from "../tx-code-store/order/storefront"
import { fixAmount } from "../common/fix-amount"
import { getMattelOrderCode } from "../tx-code-store/order/mattel-storefront"
import { getProtocolFee } from "./get-protocol-fee"
import { calculateSaleCuts } from "./common/calculate-sale-cuts"

export type FlowSellRequest = {
	collection: FlowContractAddress,
	currency: FlowCurrency,
	itemId: FlowItemId,
	sellItemPrice: string,
	originFees?: FlowOriginFees,
	payouts?: FlowPayouts,
	end?: Date,
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
		// const royalties = network === "emulator" ? [] : await fetchItemRoyalties(itemApi, itemId)
		const royalties: any = []

		const { name, map } = getCollectionConfig(network, collection)

		if (name === "HWGarageCard" || name === "HWGaragePack") {
			// init storefront and contracts
			const initTxId = await runTransaction(
				fcl,
				map,
				{
					// cadence: txInitNFTContractsAndStorefront,
					cadence: txInitNFTContractsAndStorefrontV2,
					args: fcl.args([]),
				},
				auth
			)
			await waitForSeal(fcl, initTxId)

			const txId = await runTransaction(
				fcl,
				map,
				getMattelOrderCode(fcl, name).create({
					collectionName: name,
					itemId: extractTokenId(itemId),
					saleItemPrice: fixAmount(sellItemPrice),
					customID: "RARIBLE",
					commissionAmount: fixAmount("0"),
					expiry: request.end instanceof Date
						? Math.floor(request.end.getTime() / 1000)
						: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 60,
					marketplacesAddress: [],
				}),
				auth
			)
			const tx = await waitForSeal(fcl, txId)
			console.log("init tx", JSON.stringify(tx, null, "	"))
			const simpleOrderId = parseEvents<string>(tx.events, "ListingAvailable", "listingResourceID")
			return {
				...tx,
				orderId: parseInt(simpleOrderId),
			}
		}

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
						...(royalties || []),
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
