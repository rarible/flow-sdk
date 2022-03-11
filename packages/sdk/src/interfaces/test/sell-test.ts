import type { Fcl } from "@rarible/fcl-types"
import { toBn } from "@rarible/utils"
import type { FlowContractAddress, FlowCurrency, FlowFee, FlowItemId, FlowNetwork, FlowSdk } from "../../index"
import type { FlowSellResponse } from "../order/sell"
import { checkEvent } from "../../test/check-event"
import { getOrderDetailsFromBlockchain } from "../order/common/get-order-details-from-blockchain"
import { checkSellFees } from "./check-sell-fees-test"

export async function sellTest(
	fcl: Fcl,
	sdk: FlowSdk,
	network: FlowNetwork,
	collection: FlowContractAddress,
	currency: FlowCurrency,
	itemId: FlowItemId,
	sellItemPrice: string = "1",
	payouts: FlowFee[] = [],
	originFees: FlowFee[] = [],
): Promise<FlowSellResponse> {
	const sellTx = await sdk.order.sell({
		collection,
		currency,
		itemId,
		sellItemPrice,
		payouts,
		originFees,
	})
	expect(sellTx.status).toEqual(4)
	expect(sellTx.orderId).toBeGreaterThanOrEqual(0)
	checkEvent(sellTx, "ListingAvailable", "NFTStorefront")
	const listingEvent = sellTx.events.find(e => e.type.split(".")[3] === "ListingAvailable")
	const orderProposer = listingEvent?.data.storefrontAddress
	const order = await getOrderDetailsFromBlockchain(fcl, network, "sell", orderProposer, sellTx.orderId)

	expect(order.currency).toEqual(currency)

	const [prefix, contractAddress, contractName] = order.nftType.split(".")
	expect(`${prefix}.${contractAddress}.${contractName}`).toEqual(itemId.split(":")[0])

	expect(order.nftID).toEqual(parseInt(itemId.split(":")[1]))

	expect(toBn(order.salePrice).toString()).toEqual(toBn(sellItemPrice).toString())

	checkSellFees(order.saleCuts, { payouts, originFees }, orderProposer, sellItemPrice)

	return sellTx
}
