import * as fcl from "@onflow/fcl"
import { createTestAuth, testAccount } from "@rarible/flow-test-common"
import { createFlowSdk, FlowSdk } from "../index"

describe("Minting on testnet", () => {
	let sdk: FlowSdk

	beforeAll(async () => {
		const auth = await createTestAuth(fcl, testAccount.address, testAccount.privKey, 0)
		sdk = createFlowSdk(fcl, "testnet", auth)
	})
	test("should mint nft", async () => {
		const tokenId = await sdk.nft.mint("A.0x01658d9b94068f3c.CommonNFT.NFT", "some meta", [])
		expect(tokenId).toBeGreaterThan(0)
	}, 30000)

	test("should throw error invalid collection", async () => {
		try {
			await sdk.nft.mint("A.0x0000000000000000.CommonNFT.NFT", "some meta", [])
		} catch (e) {
			expect(e).toEqual(Error("Something went wrong, transaction sent but events is empty"))
		}
	}, 30000)
})
