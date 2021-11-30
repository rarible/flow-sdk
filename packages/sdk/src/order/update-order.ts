import type { Fcl } from "@rarible/fcl-types"
import type { Maybe } from "@rarible/types/build/maybe"
import type { FlowContractAddress } from "@rarible/types"
import { toBigNumber, toFlowAddress } from "@rarible/types"
import type { FlowNftItemControllerApi, FlowOrderControllerApi } from "@rarible/flow-api-client"
import type { AuthWithPrivateKey, FlowCurrency, FlowNetwork, FlowTransaction } from "../types"
import { runTransaction, waitForSeal } from "../common/transaction"
import { getOrderCode } from "../tx-code-store/order"
import { fixAmount } from "../common/fix-amount"
import { getCollectionConfig } from "../common/collection/get-config"
import { checkPrice } from "../common/check-price"
import { getOrderDetailsFromBlockchain } from "../test/get-order-details-from-blockchain"
import { extractTokenId, toFlowItemId } from "../common/item"
import { retry } from "../common/retry"

export type FlowUpdateOrderRequest = {
	collection: FlowContractAddress,
	currency: FlowCurrency,
	orderId: number,
	sellItemPrice: string,
}

export async function updateOrder(
	fcl: Maybe<Fcl>,
	itemApi: FlowNftItemControllerApi,
	orderApi: FlowOrderControllerApi,
	auth: AuthWithPrivateKey,
	network: FlowNetwork,
	request: FlowUpdateOrderRequest,
): Promise<FlowTransaction> {
	const { collection, currency, sellItemPrice, orderId } = request
	checkPrice(sellItemPrice)
	if (fcl) {
		const from = auth ? toFlowAddress((await auth()).addr) : toFlowAddress((await fcl.currentUser().snapshot()).addr!)
		if (!from) {
			throw new Error("FLOW-SDK: Can't get current user address")
		}
		const { name, map } = getCollectionConfig(network, collection)
		switch (network) {
			case "emulator": {
				const order = await getOrderDetailsFromBlockchain(fcl, network, from, orderId)
				const itemId = toFlowItemId(`${collection}:${order.nftID}`)
				const txId = await runTransaction(
					fcl,
					map,
					getOrderCode(fcl, name).update(
						currency,
						orderId,
						fixAmount(sellItemPrice),
						extractTokenId(itemId),
						[],
						[],
						[{ account: from, value: toBigNumber("1.0") }],
					),
					auth,
				)
				return await waitForSeal(fcl, txId)
			}
			case "mainnet":
			case "testnet":
				const order = await retry(10, 1000, async () => orderApi.getOrderByOrderId({ orderId: orderId.toString() }))
				const item = await retry(10, 1000, async () => await itemApi.getNftItemById({ itemId: order.itemId }))
				const txId = await runTransaction(
					fcl,
					map,
					getOrderCode(fcl, name).update(
						currency,
						orderId,
						fixAmount(sellItemPrice),
						extractTokenId(toFlowItemId(order.itemId)),
						order.data.originalFees || [],
						item.royalties || [],
						order.data.payouts || [{ account: from, value: toBigNumber("1.0") }],
					),
					auth,
				)
				return await waitForSeal(fcl, txId)
		}
	}
	throw new Error("Fcl is required for updating order")
}
