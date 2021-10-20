import { createTestAuth, testAccount } from "@rarible/flow-test-common"
import fcl from "@onflow/fcl"
import { createFlowSdk, FlowSdk } from "../index"

describe("Test cancel order on testnet", () => {
	let sdk: FlowSdk
	const collection = "A.0x01658d9b94068f3c.CommonNFT.NFT"
	beforeAll(async () => {
		const auth = await createTestAuth(fcl, testAccount.address, testAccount.privKey, 0)
		sdk = createFlowSdk(fcl, "testnet", auth)
	})
	test("Should cancel CommonNFT order", async () => {
		const tokenId = await sdk.nft.mint(collection, "some meta", [])
		const tx = await sdk.order.sell(collection, "FLOW", tokenId, "0.1")
		const { orderId } = tx.events[1].data
		expect(orderId).toBeGreaterThan(0)
		const cancelTx = await sdk.order.cancelOrder(collection, orderId)
		expect(cancelTx.events[0].type).toEqual("A.94b06cfca1d8a476.NFTStorefront.ListingCompleted")
	}, 100000)
})

//todo write tests for cancel order by collections, evolution, topShot, motoGP
