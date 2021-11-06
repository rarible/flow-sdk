import * as fcl from "@onflow/fcl"
import { createTestAuth, FLOW_TEST_ACCOUNT_4 } from "@rarible/flow-test-common"
import type { FlowSdk } from "../index"
import { createFlowSdk } from "../index"
import { TestnetCollections } from "../config"
import { toFlowContractAddress } from "../common/flow-address"

describe("Minting on testnet", () => {
	let sdk: FlowSdk

	beforeAll(() => {
		const auth = createTestAuth(fcl, FLOW_TEST_ACCOUNT_4.address, FLOW_TEST_ACCOUNT_4.privKey, 0)
		sdk = createFlowSdk(fcl, "testnet", auth)
	})
	test("should mint nft", async () => {
		const contract = toFlowContractAddress(TestnetCollections.RARIBLE)
		const mintTx = await sdk.nft.mint(contract, "ipfs://ipfs/QmNe7Hd9xiqm1MXPtQQjVtksvWX6ieq9Wr6kgtqFo9D4CU", [])
		expect(mintTx.tokenId).toBeGreaterThan(0)
	}, 100000)

	test("should throw error invalid collection", async () => {
		expect.assertions(1)
		try {
			const contract = toFlowContractAddress("A.0x0000000000000000.CustomCollection")
			await sdk.nft.mint(contract, "ipfs://ipfs/QmNe7Hd9xiqm1MXPtQQjVtksvWX6ieq9Wr6kgtqFo9D4CU", [])
		} catch (e) {
			expect(e).toBeInstanceOf(Error)
		}
	})
})
