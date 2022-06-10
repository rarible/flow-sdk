import { toFlowAddress, toFlowContractAddress } from "@rarible/types"
import { TestnetCollections } from "../../../config/config"
import { extractTokenId } from "../../../common/item"
import { checkEvent } from "../../helpers/check-event"
import { createFlowTestTestnetSdk } from "../../helpers/testnet/create-flow-test-testnet-sdk"

describe("Test transfer on emulator", () => {
	const collection = toFlowContractAddress(TestnetCollections.RARIBLE)
	const [{ sdk, address }] = createFlowTestTestnetSdk()

	test("Should transfer NFT", async () => {
		const mintTx = await sdk.nft.mint(collection, "ipfs://ipfs/QmNe7Hd9xiqm1MXPtQQjVtksvWX6ieq9Wr6kgtqFo9D4CU", [])
		const tx = await sdk.nft.transfer(collection, extractTokenId(mintTx.tokenId), toFlowAddress(address))

		checkEvent(tx, "Withdraw", "RaribleNFT")
		checkEvent(tx, "Deposit", "RaribleNFT")
	}, 1000000)

	test("Should throw error, recipient has't initialize collection", async () => {
		const mintTx = await sdk.nft.mint(collection, "ipfs://ipfs/QmNe7Hd9xiqm1MXPtQQjVtksvWX6ieq9Wr6kgtqFo9D4CU", [])
		try {
			await sdk.nft.transfer(collection, extractTokenId(mintTx.tokenId), toFlowAddress("0xdd05e3acd01cf833"))
		} catch (e: unknown) {
			expect((e as Error).message).toBe("The recipient has't yet initialized this collection on their account, and can't receive NFT from this collection")
		}
	}, 1000000)
})
