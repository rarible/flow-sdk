import { createTestAuth, TEST_ACCOUNT_1 } from "@rarible/flow-test-common"
import fcl from "@onflow/fcl"
import { createFlowSdk, FlowSdk } from "../index"
import { checkEvent } from "../common/tests-utils"

describe("Test buy on testnet", () => {
	let sdk: FlowSdk
	const collection = "A.0x01658d9b94068f3c.CommonNFT.NFT"
	beforeAll(async () => {
		const auth = await createTestAuth(fcl, TEST_ACCOUNT_1.address, TEST_ACCOUNT_1.privKey, 0)
		sdk = createFlowSdk(fcl, "testnet", auth)
	})
	test("Should buy CommonNFT order for FLOW tokens", async () => {
		const mintTx = await sdk.nft.mint(collection, "ipfs://ipfs/QmNe7Hd9xiqm1MXPtQQjVtksvWX6ieq9Wr6kgtqFo9D4CU", [])
		const tx = await sdk.order.sell(collection, "FLOW", mintTx.tokenId, "0.1")
		const { orderId } = tx.events[1].data
		expect(orderId).toBeGreaterThan(0)
		const buyTx = await sdk.order.buy(collection, "FLOW", orderId, TEST_ACCOUNT_1.address)
		checkEvent(buyTx, "Withdraw")
		checkEvent(buyTx, "Deposit", "CommonNFT")
	}, 70000)
})

//todo write tests for buy order by collections, evolution, topShot, motoGP
