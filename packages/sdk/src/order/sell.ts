import type { Fcl } from "@rarible/fcl-types"
import type { FlowContractAddress, Maybe } from "@rarible/types"
import { toFlowAddress } from "@rarible/types"
import type { FlowNftItemControllerApi } from "@rarible/flow-api-client"
import { toBn } from "@rarible/utils"
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
import { getOrderCode } from "../tx-code-store/order/storefront"
import { fixAmount } from "../common/fix-amount"
import {getWhitelabelOrderCode, isWhitelabelCollection} from "../tx-code-store/order/whitelabel-storefront"
import { getProtocolFee } from "./get-protocol-fee"
import { calculateSaleCuts } from "./common/calculate-sale-cuts"
import { fetchItemRoyalties } from "./common/fetch-item-royalties"

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
	orderId: string
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

		const royalties = network === "emulator" ? [] : await fetchItemRoyalties(itemApi, itemId)

		const { name, map } = getCollectionConfig(network, collection)

		if (isWhitelabelCollection(name)) {
			const [fee] = originFees || []
			let comissionAmount = toBn(fee?.value || 0)
				.div(10000)
				.multipliedBy(request.sellItemPrice)
				.decimalPlaces(8)

			if (comissionAmount.gte(request.sellItemPrice)) {
				comissionAmount = toBn(0)
			}

			const txId = await runTransaction(
				fcl,
				map,
				getWhitelabelOrderCode(fcl, name).create({
					collectionName: name,
					itemId: extractTokenId(itemId),
					saleItemPrice: fixAmount(sellItemPrice),
					customID: "RARIBLE",
					commissionAmount: fixAmount(comissionAmount.toString()),
					expiry: request.end instanceof Date
						? Math.floor(request.end.getTime() / 1000)
						: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 60,
					marketplacesAddress: fee ? [toFlowAddress(fee.account)] : [],
					currency: request.currency,
				}),
				auth
			)
			const tx = await waitForSeal(fcl, txId)
			const simpleOrderId = parseEvents<string>(tx.events, "ListingAvailable", "listingResourceID")
			return {
				...tx,
				orderId: simpleOrderId,
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
			orderId: simpleOrderId,
		}
	}
	throw new Error("Fcl is required for creating order")
}
