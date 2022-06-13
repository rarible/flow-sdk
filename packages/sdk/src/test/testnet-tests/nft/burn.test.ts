import { TestnetCollections } from "../../../config/config"
import { toFlowContractAddress } from "../../../index"
import { extractTokenId } from "../../../common/item"
import { checkEvent } from "../../helpers/check-event"
import { createFlowTestTestnetSdk } from "../../helpers/testnet/create-flow-test-testnet-sdk"

describe.skip("Test burn on testnet", () => {
	const collection = toFlowContractAddress(TestnetCollections.RARIBLE)
	const [{ sdk }] = createFlowTestTestnetSdk()
	test("Should burn NFT", async () => {
		const txMint = await sdk.nft.mint(collection, "ipfs://ipfs/QmNe7Hd9xiqm1MXPtQQjVtksvWX6ieq9Wr6kgtqFo9D4CU", [])
		const txBurn = await sdk.nft.burn(collection, extractTokenId(txMint.tokenId))
		checkEvent(txBurn, "Withdraw", "RaribleNFT")
		checkEvent(txBurn, "Destroy", "RaribleNFT")
	}, 1000000)
})
