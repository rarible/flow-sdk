import { toBigNumber, toFlowContractAddress } from "@rarible/types"
import { TestnetCollections } from "../../../config/config"
import { createFlowTestTestnetSdk } from "../../helpers/testnet/create-flow-test-testnet-sdk"
import { getTestOrderTmplate } from "../../helpers/order-template"
import { checkEvent } from "../../helpers/check-event"

describe("Bid update", () => {
	const collection = toFlowContractAddress(TestnetCollections.RARIBLE)
	const [{ sdk }, { sdk: sdk1 }] = createFlowTestTestnetSdk()
	test("Should update RaribleNFT bid order", async () => {

		const mintTx = await sdk.nft.mint(
			collection,
			"ipfs://ipfs/QmNe7Hd9xiqm1MXPtQQjVtksvWX6ieq9Wr6kgtqFo9D4CU",
			[],
		)
		const tx = await sdk1.order.bid(
			collection,
			"FLOW",
			mintTx.tokenId,
			toBigNumber("0.01"),
		)
		const order = getTestOrderTmplate("bid", tx.orderId, mintTx.tokenId, toBigNumber("0.01"))
		const updateTx = await sdk1.order.bidUpdate(
			collection, "FLOW", order, toBigNumber("0.02"),
		)
		checkEvent(updateTx, "BidAvailable", "RaribleOpenBid")
	}, 1000000)
})
