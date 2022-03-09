import { toBigNumber } from "@rarible/types"
import type { FlowOrder } from "@rarible/flow-api-client"
import { toBn } from "@rarible/utils"
import type { Fcl } from "@rarible/fcl-types"
import type { FlowContractAddress, FlowCurrency, FlowNetwork, FlowSdk } from "../../index"
import { checkEvent } from "../../test/check-event"
import { getOrderDetailsFromBlockchain } from "../order/common/get-order-details-from-blockchain"
import type { FlowSellResponse } from "../order/sell"

export async function updateOrderTest(
	fcl: Fcl,
	network: FlowNetwork,
	sdk: FlowSdk,
	collection: FlowContractAddress,
	order: number | FlowOrder,
	sellItemPrice: string = "0.1",
	currency: FlowCurrency = "FLOW",
): Promise<FlowSellResponse> {
	const tx = await sdk.order.updateOrder({
		collection, currency, order, sellItemPrice: toBigNumber(sellItemPrice),
	})
	checkEvent(tx, "ListingAvailable", "NFTStorefront")
	expect(tx.orderId).toBeGreaterThanOrEqual(0)

	const orderProposer = tx.events
		.find(e => e.type.split(".")[3] === "ListingAvailable")?.data.storefrontAddress

	const blockchainOrder = await getOrderDetailsFromBlockchain(fcl, network, "sell", orderProposer, tx.orderId)

	expect(blockchainOrder.currency).toEqual(currency)

	const [prefix, contractAddress, contractName] = blockchainOrder.nftType.split(".")
	expect(`${prefix}.${contractAddress}.${contractName}`).toEqual(collection)

	expect(toBn(blockchainOrder.salePrice).toString()).toEqual(toBn(sellItemPrice).toString())

	return tx
}
