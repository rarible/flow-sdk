import { toFlowContractAddress } from "@rarible/types"
import { TestnetCollections } from "../../../config/config"
import { createFlowTestTestnetSdk } from "../../helpers/testnet/create-flow-test-testnet-sdk"
import { checkEvent } from "../../helpers/check-event"

describe("Test cancel order on testnet", () => {
	const collection = toFlowContractAddress(TestnetCollections.RARIBLE)
	const [{ sdk }] = createFlowTestTestnetSdk()

	test("Should cancel RaribleNFT order", async () => {
		const mintTx = await sdk.nft.mint(collection, "ipfs://ipfs/QmNe7Hd9xiqm1MXPtQQjVtksvWX6ieq9Wr6kgtqFo9D4CU", [])
		const tx = await sdk.order.sell({
			collection, currency: "FLOW", itemId: mintTx.tokenId, sellItemPrice: "0.1",
		})
		expect(tx.status).toEqual(4)

		const cancelTx = await sdk.order.cancelOrder(collection, tx.orderId)
		checkEvent(cancelTx, "ListingCompleted", "NFTStorefront")
	}, 1000000)
})
