import { afterTestWait, createTestAuth, FLOW_TEST_ACCOUNT_3 } from "@rarible/flow-test-common"
import fcl from "@onflow/fcl"
import { createFlowSdk, FlowSdk } from "../index"
import { checkEvent } from "../common/tests-utils"

describe("Test cancel order on testnet", () => {
	let sdk: FlowSdk
	const collection = "A.0x01658d9b94068f3c.CommonNFT.NFT"
	beforeAll(async () => {
		const auth = await createTestAuth(fcl, FLOW_TEST_ACCOUNT_3.address, FLOW_TEST_ACCOUNT_3.privKey, 0)
		sdk = createFlowSdk(fcl, "testnet", auth)
	})
	afterTestWait()
	test("Should cancel CommonNFT order", async () => {
		const mintTx = await sdk.nft.mint(collection, "ipfs://ipfs/QmNe7Hd9xiqm1MXPtQQjVtksvWX6ieq9Wr6kgtqFo9D4CU", [])
		const tx = await sdk.order.sell(collection, "FLOW", mintTx.tokenId, "0.1")
		const { orderId } = tx.events[1].data
		expect(orderId).toBeGreaterThan(0)
		const cancelTx = await sdk.order.cancelOrder(collection, orderId)
		checkEvent(cancelTx, "ListingCompleted", "NFTStorefront")
	})
})
