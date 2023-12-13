import { toBigNumberLike, toFlowAddress, toFlowContractAddress } from "@rarible/types"
import { TestnetCollections } from "../../../config/config"
import { createFlowTestTestnetSdk } from "../../helpers/testnet/create-flow-test-testnet-sdk"
import { checkEvent } from "../../helpers/check-event"

describe.skip("Test cancel order on testnet", () => {
	const collection = toFlowContractAddress(TestnetCollections.RARIBLE)
	const [{ sdk: sdk1 }, { sdk: sdk2, address: address2 }] = createFlowTestTestnetSdk()

	test("Should cancel RaribleNFT bid order", async () => {
		const mintTx = await sdk1.nft.mint(
			collection,
			"ipfs://ipfs/QmNe7Hd9xiqm1MXPtQQjVtksvWX6ieq9Wr6kgtqFo9D4CU",
			[],
		)

		const tx = await sdk2.order.bid(
			collection,
			"FLOW",
			mintTx.tokenId,
			toBigNumberLike("1"),
			[{ account: toFlowAddress(address2), value: toBigNumberLike("0.03") }],
		)
		expect(tx.status).toEqual(4)

		const cancelBidTx = await sdk2.order.cancelBid(collection, tx.orderId)
		checkEvent(cancelBidTx, "BidCompleted", "RaribleOpenBid")
	}, 1000000)
})
