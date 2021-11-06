import { createTestAuth, FLOW_TEST_ACCOUNT_3 } from "@rarible/flow-test-common"
import fcl from "@onflow/fcl"
import type { FlowSdk } from "../index"
import { createFlowSdk } from "../index"
import { TestnetCollections } from "../config"
import { extractOrder } from "../test/extract-order"
import { checkEvent } from "../test/check-event"
import { toFlowContractAddress } from "../common/flow-address"

describe("Test update sell order on testnet", () => {
	let sdk: FlowSdk
	const collection = toFlowContractAddress(TestnetCollections.RARIBLE)

	beforeAll(() => {
		const auth = createTestAuth(fcl, FLOW_TEST_ACCOUNT_3.address, FLOW_TEST_ACCOUNT_3.privKey, 0)
		sdk = createFlowSdk(fcl, "testnet", auth)
	})

	test("Should update RaribleNFT sell order", async () => {
		const mintTx = await sdk.nft.mint(
			collection,
			"ipfs://ipfs/QmNe7Hd9xiqm1MXPtQQjVtksvWX6ieq9Wr6kgtqFo9D4CU",
			[{ account: FLOW_TEST_ACCOUNT_3.address, value: "0.1" }],
		)
		const tx = await sdk.order.sell(collection, "FLOW", mintTx.tokenId, "0.1")
		checkEvent(tx, "ListingAvailable", "NFTStorefront")
		checkEvent(tx, "OrderAvailable", "RaribleOrder")
		const order = extractOrder(tx)
		expect(order.price).toEqual("0.10000000")

		const updateTx = await sdk.order.updateOrder(collection, "FLOW", order.orderId, "0.2")
		const updatedOrder = extractOrder(updateTx)
		expect(updatedOrder.price).toEqual("0.20000000")
	})
})

//todo write tests for sell by collections, evolution, topShot, motoGP
