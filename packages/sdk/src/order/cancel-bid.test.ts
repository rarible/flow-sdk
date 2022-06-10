import { createFlowEmulator } from "@rarible/flow-test-common"
import { toBigNumber, toFlowAddress } from "@rarible/types"
import { toFlowContractAddress } from "../index"
import { EmulatorCollections } from "../config/config"
import { createFlowTestEmulatorSdk } from "../test/helpers/emulator/create-flow-test-sdk"
import { checkEvent } from "../test/helpers/check-event"

describe("Test cancel order on emulator", () => {
	createFlowEmulator({})
	const collection = toFlowContractAddress(EmulatorCollections.RARIBLE)


	test("Should cancel RaribleNFT bid order", async () => {
		const { sdk: sdk1 } = await createFlowTestEmulatorSdk("accountName1")
		const { sdk: sdk2, address: address2 } = await createFlowTestEmulatorSdk("accountName2")
		const mintTx = await sdk1.nft.mint(
			collection,
			"ipfs://ipfs/QmNe7Hd9xiqm1MXPtQQjVtksvWX6ieq9Wr6kgtqFo9D4CU",
			[],
		)

		const tx = await sdk2.order.bid(
			collection,
			"FLOW",
			mintTx.tokenId,
			toBigNumber("1"),
			[{ account: toFlowAddress(address2), value: toBigNumber("0.03") }],
		)
		expect(tx.status).toEqual(4)

		const cancelBidTx = await sdk2.order.cancelBid(collection, tx.orderId)
		checkEvent(cancelBidTx, "BidCompleted", "RaribleOpenBid")

	})

})
