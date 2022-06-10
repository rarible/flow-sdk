import { TestnetCollections } from "../../../config/config"
import { toFlowContractAddress } from "../../../index"
import { createFlowTestTestnetSdk } from "../../helpers/testnet/create-flow-test-testnet-sdk"

describe("Minting on testnet", () => {
	const [{ sdk }] = createFlowTestTestnetSdk()

	test("should mint nft", async () => {
		const contract = toFlowContractAddress(TestnetCollections.RARIBLE)
		const mintTx = await sdk.nft.mint(
			contract, "ipfs://ipfs/QmNe7Hd9xiqm1MXPtQQjVtksvWX6ieq9Wr6kgtqFo9D4CU", [])
		expect(mintTx.status).toEqual(4)
	}, 1000000)
})
