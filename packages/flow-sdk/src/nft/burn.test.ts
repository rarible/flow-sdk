import { createTestAuth, testAccount } from "@rarible/flow-test-common"
import fcl from "@onflow/fcl"
import { createFlowSdk, FlowSdk } from "../index"
import { checkEvent } from "../common/tests-utils"

describe("Test burn on testnet", () => {
	let sdk: FlowSdk
	const collection = "A.0x01658d9b94068f3c.CommonNFT.NFT"
	beforeAll(async () => {
		const auth = await createTestAuth(fcl, testAccount.address, testAccount.privKey, 0)
		sdk = createFlowSdk(fcl, "testnet", auth)
	})
	test("Should burn NFT", async () => {
		const txMint = await sdk.nft.mint(collection, "some meta", [])
		const txBurn = await sdk.nft.burn(collection, txMint.tokenId)
		checkEvent(txBurn, "Withdraw", "CommonNFT")
		checkEvent(txBurn, "Destroy", "CommonNFT")
	}, 50000)
})
