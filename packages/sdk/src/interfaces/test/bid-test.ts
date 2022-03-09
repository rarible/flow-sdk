import { toBn } from "@rarible/utils"
import { toBigNumber, toFlowAddress } from "@rarible/types"
import type { FlowContractAddress, FlowCurrency, FlowFee, FlowItemId, FlowSdk } from "../../index"
import type { FlowSellResponse } from "../order/sell"
import { checkEvent } from "../../test/check-event"
import { checkBidFees } from "./check-bid-fees-test"

export async function bidTest(
	sdk: FlowSdk,
	collection: FlowContractAddress,
	currency: FlowCurrency,
	itemId: FlowItemId,
	bidPrice: string = "1",
	originFees: FlowFee[] = [],
): Promise<FlowSellResponse> {
	const bidTx = await sdk.order.bid(
		collection,
		currency,
		itemId,
		toBigNumber(bidPrice),
		originFees,
	)
	expect(bidTx.status).toEqual(4)
	expect(bidTx.orderId).toBeGreaterThanOrEqual(0)
	checkEvent(bidTx, "BidAvailable", "RaribleOpenBid")
	const bidEvent = bidTx.events.find(e => e.type.split(".")[3] === "BidAvailable")
	if (!(bidEvent && "data" in bidEvent)) {
		throw new Error("No bid event or data in it")
	}
	const order = {
		...bidEvent.data,
		cuts: Object.keys(bidEvent.data.cuts).map(e => {
			return { account: toFlowAddress(e), value: toBigNumber(bidEvent.data.cuts[e]) }
		}),
		currency,
	}
	expect(order.currency).toEqual(currency)

	const [prefix, contractAddress, contractName] = order.nftType.split(".")
	expect(`${prefix}.${contractAddress}.${contractName}`).toEqual(itemId.split(":")[0])

	expect(order.nftId).toEqual(parseInt(itemId.split(":")[1]))

	expect(toBn(order.bidPrice).toString()).toEqual(toBn(bidPrice).toString())
	checkBidFees(order.cuts, originFees, bidPrice)

	return bidTx
}
