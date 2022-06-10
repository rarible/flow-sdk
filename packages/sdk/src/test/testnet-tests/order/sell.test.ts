import { FLOW_TESTNET_ACCOUNT_4 } from "@rarible/flow-test-common"
import { toBigNumber, toFlowAddress, toFlowContractAddress } from "@rarible/types"
import { TestnetCollections } from "../../../config/config"
import { createFlowTestTestnetSdk } from "../../helpers/testnet/create-flow-test-testnet-sdk"

describe("Test sell on testnet", () => {
	const collection = toFlowContractAddress(TestnetCollections.RARIBLE)
	const [{ sdk }] = createFlowTestTestnetSdk()

	test("Should create new sell order on testnet", async () => {
		const mintTx = await sdk.nft.mint(
			collection,
			"ipfs://ipfs/QmNe7Hd9xiqm1MXPtQQjVtksvWX6ieq9Wr6kgtqFo9D4CU",
			[{ account: toFlowAddress(FLOW_TESTNET_ACCOUNT_4.address), value: toBigNumber("0.1") }],
		)

		const orderTx = await sdk.order.sell({
			collection: collection,
			currency: "FLOW",
			itemId: mintTx.tokenId,
			sellItemPrice: "1",
			originFees: [{ account: toFlowAddress(FLOW_TESTNET_ACCOUNT_4.address), value: toBigNumber("0.2") }],
		})

		expect(orderTx.orderId).toBeTruthy()

	}, 1000000)

	test("Should create RaribleNFT sell order testnet", async () => {
		const mintTx = await sdk.nft.mint(
			collection,
			"ipfs://ipfs/QmNe7Hd9xiqm1MXPtQQjVtksvWX6ieq9Wr6kgtqFo9D4CU",
			[],
		)
		const tx = await sdk.order.sell({
			collection,
			currency: "FLOW",
			itemId: mintTx.tokenId,
			sellItemPrice: "1",
			payouts: [],
			originFees: [],
		})
		expect(tx.status).toEqual(4)
	}, 1000000)
})
