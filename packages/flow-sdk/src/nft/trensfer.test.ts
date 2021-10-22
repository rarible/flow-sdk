import { createTestAuth, testAccount } from "@rarible/flow-test-common"
import fcl from "@onflow/fcl"
import { createFlowSdk, FlowSdk } from "../index"
import { checkEvent } from "../common/tests-utils"

describe("Test transfer on testnet", () => {
	let sdk: FlowSdk
	const collection = "A.0x01658d9b94068f3c.CommonNFT.NFT"
	beforeAll(async () => {
		const auth = await createTestAuth(fcl, testAccount.address, testAccount.privKey, 0)
		sdk = createFlowSdk(fcl, "testnet", auth)
	})
	test("Should transfer NFT", async () => {
		const mintTx = await sdk.nft.mint(collection, "some meta", [])
		const tx = await sdk.nft.transfer(collection, mintTx.tokenId, testAccount.address)
		checkEvent(tx, "Withdraw", "CommonNFT")
		checkEvent(tx, "Deposit", "CommonNFT")
	}, 50000)
})
