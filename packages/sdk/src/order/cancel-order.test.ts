import { createTestAuth } from "@rarible/flow-test-common"
import fcl from "@onflow/fcl"
import { createEmulatorAccount, createFlowEmulator } from "@rarible/flow-test-common/src"
import type { FlowSdk } from "../index"
import { createFlowSdk } from "../index"
import { checkEvent } from "../test/check-event"
import { EmulatorCollections } from "../config"
import { toFlowContractAddress } from "../common/flow-address"

describe("Test cancel order on emulator", () => {
	let sdk: FlowSdk
	createFlowEmulator({})
	const collection = toFlowContractAddress(EmulatorCollections.RARIBLE)

	beforeAll(async () => {
		const { address, pk } = await createEmulatorAccount("accountName")
		const auth = createTestAuth(fcl, "emulator", address, pk, 0)
		sdk = createFlowSdk(fcl, "emulator", auth)
	})

	test("Should cancel RaribleNFT order", async () => {
		const mintTx = await sdk.nft.mint(collection, "ipfs://ipfs/QmNe7Hd9xiqm1MXPtQQjVtksvWX6ieq9Wr6kgtqFo9D4CU", [])
		const tx = await sdk.order.sell(collection, "FLOW", mintTx.tokenId, "0.1")
		const { orderId } = tx.events[2].data
		expect(tx.status).toEqual(4)
		const cancelTx = await sdk.order.cancelOrder(collection, orderId)
		checkEvent(cancelTx, "ListingCompleted", "NFTStorefront")
	})
})
