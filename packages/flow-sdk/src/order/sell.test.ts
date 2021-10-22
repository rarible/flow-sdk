import { createTestAuth, testAccount } from "@rarible/flow-test-common"
import fcl from "@onflow/fcl"
import { createFlowSdk, FlowSdk } from "../index"
import { checkEvent } from "../common/tests-utils"

describe("Test sell on testnet", () => {
	let sdk: FlowSdk
	const collection = "A.0x01658d9b94068f3c.CommonNFT.NFT"
	beforeAll(async () => {
		const auth = await createTestAuth(fcl, testAccount.address, testAccount.privKey, 0)
		sdk = createFlowSdk(fcl, "testnet", auth)
	})
	test("Should create CommonNFT sell order", async () => {
		const mintTx = await sdk.nft.mint(
			collection,
			"some meta",
			[{ account: testAccount.address, value: "0.1" }]
		)
		const tx = await sdk.order.sell(collection, "FLOW", mintTx.tokenId, "0.1")
		checkEvent(tx, "ListingAvailable", "NFTStorefront")
		checkEvent(tx, "OrderAvailable", "CommonOrder")
		expect(tx.events[1].data.orderId).toBeGreaterThan(0)
	}, 50000)
})

//todo write tests for sell by collections, evolution, topShot, motoGP
