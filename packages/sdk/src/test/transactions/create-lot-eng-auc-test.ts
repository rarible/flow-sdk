import type { FlowContractAddress, FlowItemId, FlowSdk } from "../../index"
import type { FlowSellResponse } from "../../order/sell"

/**
 *
 * @param sdk
 * @param collection
 * @param itemId
 * @param buyoutPrice
 * @param duration - number seconds
 */
export async function createLotEngAucTest(
	sdk: FlowSdk,
	collection: FlowContractAddress,
	itemId: FlowItemId,
	buyoutPrice: string,
	duration: number,
): Promise<FlowSellResponse> {
	const startAt = ((new Date().getTime() - (10 * 1000)) / 1000).toString()
	return sdk.auction.createLot({
		collection,
		currency: "FLOW",
		itemId: itemId,
		minimumBid: "0.0001",
		buyoutPrice,
		increment: "0.0001",
		startAt,
		duration: duration.toString(),
		payouts: [],
		originFees: [],
	})
}
