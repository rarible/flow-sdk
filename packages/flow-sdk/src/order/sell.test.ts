import { createTestAuth, testAccount } from "@rarible/flow-test-common"
import fcl from "@onflow/fcl"
import { createFlowSdk, FlowSdk } from "../index"

describe("Test sell on testnet", () => {
	let sdk: FlowSdk
	const collection = "A.0x01658d9b94068f3c.CommonNFT.NFT"
	beforeAll(async () => {
		const auth = await createTestAuth(fcl, testAccount.address, testAccount.privKey, 0)
		sdk = createFlowSdk(fcl, "testnet", auth)
	})
	test("Should create CommonNFT sell order", async () => {
		const tokenId = await sdk.nft.mint(collection, "some meta", [])
		const tx = await sdk.order.sell(collection, "FLOW", tokenId, "0.1")
		expect(tx.events[0].type).toEqual("A.94b06cfca1d8a476.NFTStorefront.ListingAvailable")
		expect(tx.events[1].type).toEqual("A.01658d9b94068f3c.CommonOrder.OrderAvailable")
		expect(tx.events[1].data.orderId).toBeGreaterThan(0)
	}, 50000)
})

//todo write tests for sell by collections, evolution, topShot, motoGP
