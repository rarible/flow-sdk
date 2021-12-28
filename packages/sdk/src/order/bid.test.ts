import { createFlowEmulator } from "@rarible/flow-test-common"
import { toBigNumber, toFlowAddress } from "@rarible/types"
import { toFlowContractAddress } from "../index"
import { EmulatorCollections } from "../config/config"
import { createFlowTestEmulatorSdk } from "../test/create-flow-test-sdk"
import { mintRaribleNftTest } from "../test/transactions/mint-test"
import { checkEvent } from "../test/check-event"
import { getTestOrderTmplate } from "../test/order-template"

describe("Test bid on emulator", () => {
	createFlowEmulator({})
	const collection = toFlowContractAddress(EmulatorCollections.RARIBLE)

	test("Should create/update/cancel RaribleNFT bid order", async () => {
		const { sdk: sdk1 } = await createFlowTestEmulatorSdk("accountName1")
		const { sdk: sdk2, address: address2 } = await createFlowTestEmulatorSdk("accountName2")

		const mintTx = await mintRaribleNftTest(sdk1, collection)

		const tx = await sdk2.order.bid(
			collection,
			"FLOW",
			mintTx.tokenId,
			toBigNumber("1"),
			[{ account: toFlowAddress(address2), value: toBigNumber("0.03") }],
		)
		expect(tx.status).toEqual(4)

		const order = getTestOrderTmplate("bid", tx.orderId, mintTx.tokenId, toBigNumber("0.01"))
		const updateTx = await sdk2.order.bidUpdate(
			collection, "FLOW", order, toBigNumber("2"),
		)
		checkEvent(updateTx, "BidAvailable", "RaribleOpenBid")

		const cancelBidTx = await sdk2.order.cancelBid(collection, updateTx.orderId)
		checkEvent(cancelBidTx, "BidCompleted", "RaribleOpenBid")
	})
})
