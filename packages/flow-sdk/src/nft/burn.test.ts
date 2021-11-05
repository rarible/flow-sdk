import { createTestAuth, FLOW_TEST_ACCOUNT_3 } from "@rarible/flow-test-common"
import fcl from "@onflow/fcl"
import type { FlowSdk } from "../index"
import { createFlowSdk } from "../index"
import { checkEvent } from "../common/tests-utils"
import { TestnetCollections } from "../config"

describe("Test burn on testnet", () => {
	let sdk: FlowSdk
	const collection = TestnetCollections.RARIBLE
	beforeAll(async () => {
		const auth = await createTestAuth(fcl, FLOW_TEST_ACCOUNT_3.address, FLOW_TEST_ACCOUNT_3.privKey, 0)
		sdk = createFlowSdk(fcl, "testnet", auth)
	})
	test("Should burn NFT", async () => {
		const txMint = await sdk.nft.mint(collection, "ipfs://ipfs/QmNe7Hd9xiqm1MXPtQQjVtksvWX6ieq9Wr6kgtqFo9D4CU", [])
		const txBurn = await sdk.nft.burn(collection, txMint.tokenId)
		checkEvent(txBurn, "Withdraw", "RaribleNFT")
		checkEvent(txBurn, "Destroy", "RaribleNFT")
	})
})
