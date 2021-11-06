import { createTestAuth, FLOW_TEST_ACCOUNT_3 } from "@rarible/flow-test-common"
import fcl from "@onflow/fcl"
import type { FlowSdk } from "../index"
import { createFlowSdk } from "../index"
import { checkEvent } from "../test/check-event"
import { TestnetCollections } from "../config"
import { toFlowAddress, toFlowContractAddress } from "../common/flow-address"

describe("Test transfer on testnet", () => {
	let sdk: FlowSdk
	const collection = toFlowContractAddress(TestnetCollections.RARIBLE)

	beforeAll(() => {
		const auth = createTestAuth(fcl, FLOW_TEST_ACCOUNT_3.address, FLOW_TEST_ACCOUNT_3.privKey, 0)
		sdk = createFlowSdk(fcl, "testnet", auth)
	})

	test("Should transfer NFT", async () => {
		const mintTx = await sdk.nft.mint(collection, "ipfs://ipfs/QmNe7Hd9xiqm1MXPtQQjVtksvWX6ieq9Wr6kgtqFo9D4CU", [])
		const tx = await sdk.nft.transfer(collection, mintTx.tokenId, toFlowAddress(FLOW_TEST_ACCOUNT_3.address))
		checkEvent(tx, "Withdraw", "RaribleNFT")
		checkEvent(tx, "Deposit", "RaribleNFT")
	})
})