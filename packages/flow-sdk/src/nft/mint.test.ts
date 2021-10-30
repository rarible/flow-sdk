import * as fcl from "@onflow/fcl"
import { afterTestWait, createTestAuth, FLOW_TEST_ACCOUNT_3 } from "@rarible/flow-test-common"
import { createFlowSdk, FlowSdk } from "../index"

describe("Minting on testnet", () => {
	let sdk: FlowSdk

	beforeAll(async () => {
		const auth = await createTestAuth(fcl, FLOW_TEST_ACCOUNT_3.address, FLOW_TEST_ACCOUNT_3.privKey, 0)
		sdk = createFlowSdk(fcl, "testnet", auth)
	})
	afterTestWait()
	test("should mint nft", async () => {
		const mintTx = await sdk.nft.mint("A.01658d9b94068f3c.CommonNFT", "ipfs://ipfs/QmNe7Hd9xiqm1MXPtQQjVtksvWX6ieq9Wr6kgtqFo9D4CU", [])
		expect(mintTx.tokenId).toBeGreaterThan(0)
	})

	test("should throw error invalid collection", async () => {
		expect.assertions(1)
		try {
			await sdk.nft.mint("A.0x0000000000000000.CustomCollection", "ipfs://ipfs/QmNe7Hd9xiqm1MXPtQQjVtksvWX6ieq9Wr6kgtqFo9D4CU", [])
		} catch (e) {
			expect(e).toBeInstanceOf(Error)
		}
	})
})
