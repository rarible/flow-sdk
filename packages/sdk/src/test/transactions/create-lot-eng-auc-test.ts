import type { FlowContractAddress, FlowFee, FlowItemId, FlowSdk } from "../../index"
import type { FlowEnglishAuctionTransaction } from "../../interfaces/auction/domain"

const MINIMAL_DURATION = (15 * 60).toString()

export async function createLotEngAucTest(
	sdk: FlowSdk,
	collection: FlowContractAddress,
	request: {
		itemId: FlowItemId,
		startAt?: string,
		buyoutPrice?: string,
		duration?: string,
		payouts?: FlowFee[],
		originFees?: FlowFee[]
	}):
	Promise<FlowEnglishAuctionTransaction> {
	const { itemId, buyoutPrice, duration, payouts, originFees, startAt } = request
	const tx = await sdk.auction.createLot({
		collection,
		currency: "FLOW",
		itemId,
		minimumBid: "0.0001",
		buyoutPrice,
		increment: "0.0001",
		startAt,
		duration: duration || MINIMAL_DURATION,
		payouts,
		originFees,
	})
	expect(parseInt(tx.lotId)).toBeGreaterThanOrEqual(0)
	return tx
}