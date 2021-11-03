import { afterTestWait, createTestAuth, FLOW_TEST_ACCOUNT_3 } from "@rarible/flow-test-common"
import fcl from "@onflow/fcl"
import { createFlowSdk, FlowSdk } from "../index"
import { checkEvent } from "../common/tests-utils"

describe("Test buy on testnet", () => {
	let sdk: FlowSdk
	const collection = "A.0xebf4ae01d1284af8.RaribleNFT"
	beforeAll(async () => {
		const auth = await createTestAuth(fcl, FLOW_TEST_ACCOUNT_3.address, FLOW_TEST_ACCOUNT_3.privKey, 0)
		sdk = createFlowSdk(fcl, "testnet", auth)
	})
	afterTestWait()
	test.skip("Should buy RaribleNFT order for FLOW tokens", async () => {
		const mintTx = await sdk.nft.mint(collection, "ipfs://ipfs/QmNe7Hd9xiqm1MXPtQQjVtksvWX6ieq9Wr6kgtqFo9D4CU", [])
		expect(mintTx.tokenId).toBeGreaterThan(0)
		const tx = await sdk.order.sell(collection, "FLOW", mintTx.tokenId, "0.1")
		const { orderId } = tx.events[1].data
		expect(orderId).toBeGreaterThan(0)
		const buyTx = await sdk.order.buy(collection, "FLOW", orderId, FLOW_TEST_ACCOUNT_3.address)
		checkEvent(buyTx, "Withdraw")
		checkEvent(buyTx, "Deposit", "RaribleNFT")
	})
})

//todo write tests for buy order by collections, evolution, topShot, motoGP
