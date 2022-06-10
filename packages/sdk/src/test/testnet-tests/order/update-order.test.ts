import { FLOW_TESTNET_ACCOUNT_2, FLOW_TESTNET_ACCOUNT_3 } from "@rarible/flow-test-common"
import { toBigNumber, toFlowAddress, toFlowContractAddress } from "@rarible/types"
import { createFlowTestTestnetSdk } from "../../helpers/testnet/create-flow-test-testnet-sdk"
import { TestnetCollections } from "../../../config/config"
import { getTestOrderTmplate } from "../../helpers/order-template"
import { checkEvent } from "../../helpers/check-event"

describe("Test update sell order on testnet", () => {
	const collection = toFlowContractAddress(TestnetCollections.RARIBLE)
	const [{ sdk }] = createFlowTestTestnetSdk()

	test("Should update RaribleNFT sell order on testnet", async () => {
		const mintTx = await sdk.nft.mint(
			collection,
			"ipfs://ipfs/QmNe7Hd9xiqm1MXPtQQjVtksvWX6ieq9Wr6kgtqFo9D4CU",
			[{ account: toFlowAddress(FLOW_TESTNET_ACCOUNT_3.address), value: toBigNumber("0.1") }],
		)
		const orderTx = await sdk.order.sell({
			collection: collection,
			currency: "FLOW",
			itemId: mintTx.tokenId,
			sellItemPrice: "1",
			originFees: [{ account: toFlowAddress(FLOW_TESTNET_ACCOUNT_2.address), value: toBigNumber("0.05") }],
		})

		const updateTx = await sdk.order.updateOrder({
			collection, currency: "FLOW", order: orderTx.orderId, sellItemPrice: toBigNumber("0.2"),
		})
		checkEvent(updateTx, "ListingAvailable", "NFTStorefront")
	}, 1000000)

	test("Should update RaribleNFT sell order", async () => {
		const mintTx = await sdk.nft.mint(
			collection,
			"ipfs://ipfs/QmNe7Hd9xiqm1MXPtQQjVtksvWX6ieq9Wr6kgtqFo9D4CU",
			[],
		)
		const tx = await sdk.order.sell({
			collection,
			currency: "FLOW",
			itemId: mintTx.tokenId,
			sellItemPrice: "0.1",
		})
		checkEvent(tx, "ListingAvailable", "NFTStorefront")
		const order = getTestOrderTmplate("sell", tx.orderId, mintTx.tokenId, toBigNumber("0.1"))
		const updateTx = await sdk.order.updateOrder({
			collection, currency: "FLOW", order, sellItemPrice: toBigNumber("0.2"),
		})
		checkEvent(updateTx, "ListingAvailable", "NFTStorefront")
	}, 1000000)
})
