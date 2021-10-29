import { afterTestWait, createTestAuth, TEST_ACCOUNT_1 } from "@rarible/flow-test-common"
import fcl from "@onflow/fcl"
import { createFlowSdk, FlowSdk } from "../index"
import { checkEvent } from "../common/tests-utils"

describe("Test transfer on testnet", () => {
	let sdk: FlowSdk
	const collection = "A.0x01658d9b94068f3c.CommonNFT.NFT"
	beforeAll(async () => {
		const auth = await createTestAuth(fcl, TEST_ACCOUNT_1.address, TEST_ACCOUNT_1.privKey, 0)
		sdk = createFlowSdk(fcl, "testnet", auth)
	})
	afterTestWait()
	test("Should transfer NFT", async () => {
		const mintTx = await sdk.nft.mint(collection, "ipfs://ipfs/QmNe7Hd9xiqm1MXPtQQjVtksvWX6ieq9Wr6kgtqFo9D4CU", [])
		const tx = await sdk.nft.transfer(collection, mintTx.tokenId, TEST_ACCOUNT_1.address)
		checkEvent(tx, "Withdraw", "CommonNFT")
		checkEvent(tx, "Deposit", "CommonNFT")
	})
})