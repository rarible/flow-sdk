import { createTestAuth, testAccount } from "@rarible/flow-test-common"
import fcl from "@onflow/fcl"
import { createFlowSdk, FlowSdk } from "../index"

describe("Test burn on testnet", () => {
	let sdk: FlowSdk
	const collection = "A.0x01658d9b94068f3c.CommonNFT.NFT"
	beforeAll(async () => {
		const auth = await createTestAuth(fcl, testAccount.address, testAccount.privKey, 0)
		sdk = createFlowSdk(fcl, "testnet", auth)
	})
	test("Should burn NFT", async () => {
		const tokenId = await sdk.nft.mint(collection, "some meta", [])
		const tx = await sdk.nft.burn(collection, tokenId)
		expect(tx.events[0].type).toEqual("A.01658d9b94068f3c.CommonNFT.Withdraw")
		expect(tx.events[1].type).toEqual("A.01658d9b94068f3c.CommonNFT.Destroy")
	}, 50000)
})
