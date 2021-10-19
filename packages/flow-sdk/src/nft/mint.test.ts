import * as fcl from "@onflow/fcl"
import { createTestAuth, testAccount } from "@rarible/flow-test-common"
import { createFlowSdk, FlowSdk } from "../index"

describe("Minting test-emulator", () => {
	let sdk: FlowSdk

	beforeAll(async () => {
		const auth = createTestAuth(fcl, testAccount.address, testAccount.privKey, 0)
		sdk = createFlowSdk(fcl, "testnet", auth)
	})
	test("test-emulator mint nft", async () => {
		await sdk.nft.mint("A.0x665b9acf64dfdfdb.CommonNFT.NFT", "some meta", [])
		//todo change mint response to TxResponse with events and check minted from events
		expect(1).toBe(1)
	}, 30000)
})
