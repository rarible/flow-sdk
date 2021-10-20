import { createTestAuth, testAccount } from "@rarible/flow-test-common"
import fcl from "@onflow/fcl"
import { createFlowSdk, FlowSdk } from "../index"

describe("Test transfer on testnet", () => {
	let sdk: FlowSdk
	const collection = "A.0x01658d9b94068f3c.CommonNFT.NFT"
	const testAccountAddress = "0x285b7909b8ed1652"
	beforeAll(async () => {
		const auth = await createTestAuth(fcl, testAccount.address, testAccount.privKey, 0)
		sdk = createFlowSdk(fcl, "testnet", auth)
	})
	test("Should transfer NFT", async () => {
		const tokenId = await sdk.nft.mint(collection, "some meta", [])
		const tx = await sdk.nft.transfer(collection, tokenId, testAccountAddress)
		expect(tx.events[0].type).toEqual("A.01658d9b94068f3c.CommonNFT.Withdraw")
		expect(tx.events[1].type).toEqual("A.01658d9b94068f3c.CommonNFT.Deposit")
	}, 50000)
})
