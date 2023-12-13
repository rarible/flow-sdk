import { createEmulatorAccount, createFlowEmulator, createTestAuth } from "@rarible/flow-test-common"
import fcl from "@onflow/fcl"
import { toBigNumberLike, toFlowContractAddress } from "@rarible/types"
import { createFlowSdk } from "../index"
import { getTestOrderTmplate } from "../test/helpers/order-template"
import { checkEvent } from "../test/helpers/check-event"
import { EmulatorCollections } from "../config/config"

describe("Bid update", () => {
	createFlowEmulator({})
	const collection = toFlowContractAddress(EmulatorCollections.RARIBLE)
	test("Should update RaribleNFT bid order", async () => {
		const { address, pk } = await createEmulatorAccount("accountName")
		const auth = createTestAuth(fcl, "emulator", address, pk, 0)
		const sdk = createFlowSdk(fcl, "emulator", {}, auth)
		const { address: address1, pk: pk1 } = await createEmulatorAccount("accountName")
		const auth1 = createTestAuth(fcl, "emulator", address1, pk1, 0)
		const sdk1 = createFlowSdk(fcl, "emulator", {}, auth1)

		const mintTx = await sdk.nft.mint(
			collection,
			"ipfs://ipfs/QmNe7Hd9xiqm1MXPtQQjVtksvWX6ieq9Wr6kgtqFo9D4CU",
			[],
		)
		const tx = await sdk1.order.bid(
			collection,
			"FLOW",
			mintTx.tokenId,
			toBigNumberLike("0.01"),
		)
		const order = getTestOrderTmplate("bid", tx.orderId, mintTx.tokenId, toBigNumberLike("0.01"))
		const updateTx = await sdk1.order.bidUpdate(
			collection, "FLOW", order, toBigNumberLike("0.02"),
		)
		checkEvent(updateTx, "BidAvailable", "RaribleOpenBid")
	})
})
