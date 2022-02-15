import type { FlowContractAddress, FlowFee, FlowItemId, FlowSdk } from "../../index"
import type { FlowSellResponse } from "../../interfaces/order/sell"

export async function createLotEngAucTest(
	sdk: FlowSdk,
	collection: FlowContractAddress,
	request: {
		itemId: FlowItemId,
		startAt?: string,
		buyoutPrice?: string,
		duration: string,
		payouts?: FlowFee[],
		originFees?: FlowFee[]
	}):
	Promise<FlowSellResponse> {
	const { itemId, buyoutPrice, duration, payouts, originFees, startAt } = request
	return sdk.auction.createLot({
		collection,
		currency: "FLOW",
		itemId,
		minimumBid: "0.0001",
		buyoutPrice,
		increment: "0.0001",
		startAt,
		duration,
		payouts,
		originFees,
	})
}
