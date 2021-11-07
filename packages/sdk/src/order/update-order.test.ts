import { createTestAuth } from "@rarible/flow-test-common"
import fcl from "@onflow/fcl"
import { createEmulatorAccount, createFlowEmulator } from "@rarible/flow-test-common/src"
import type { FlowSdk } from "../index"
import { createFlowSdk } from "../index"
import { EmulatorCollections } from "../config"
import { extractOrder } from "../test/extract-order"
import { checkEvent } from "../test/check-event"
import { toFlowContractAddress } from "../common/flow-address"

describe("Test update sell order on emulator", () => {
	let sdk: FlowSdk
	createFlowEmulator({})
	const collection = toFlowContractAddress(EmulatorCollections.RARIBLE)

	beforeAll(async () => {
		const { address, pk } = await createEmulatorAccount("accountName")
		const auth = createTestAuth(fcl, "emulator", address, pk, 0)
		sdk = createFlowSdk(fcl, "emulator", auth)
	})

	test("Should update RaribleNFT sell order", async () => {
		const mintTx = await sdk.nft.mint(
			collection,
			"ipfs://ipfs/QmNe7Hd9xiqm1MXPtQQjVtksvWX6ieq9Wr6kgtqFo9D4CU",
			[],
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
