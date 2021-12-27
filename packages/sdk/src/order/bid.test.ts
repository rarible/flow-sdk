import { createFlowEmulator } from "@rarible/flow-test-common"
import { toBigNumber, toFlowAddress } from "@rarible/types"
import fcl from "@onflow/fcl"
import { toFlowContractAddress, toFlowItemId } from "../index"
import { EmulatorCollections } from "../config/config"
import { createFlowTestEmulatorSdk } from "../test/create-flow-test-sdk"
import { mintRaribleNftTest } from "../test/transactions/mint-test"
import { checkEvent } from "../test/check-event"
import { getTestOrderTmplate } from "../test/order-template"
import { createEvolutionTestEnvironment, getEvolutionIds } from "../test/evolution"
import { borrowMotoGpCardId, createMotoGpTestEnvironment } from "../test/moto-gp-card"

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

	test("Should create/update/cancel Evolution bid order", async () => {
		const evolutionCollection = toFlowContractAddress(EmulatorCollections.EVOLUTION)
		const { acc1, acc2, serviceAcc } = await createEvolutionTestEnvironment(fcl)

		const result = await getEvolutionIds(fcl, serviceAcc.address, acc1.address, acc1.tokenId)
		expect(result.data.itemId).toEqual(1)

		const itemId = toFlowItemId(`${evolutionCollection}:${result.data.itemId}`)

		const tx = await acc2.sdk.order.bid(
			evolutionCollection,
			"FLOW",
			itemId,
			toBigNumber("1"),
			[{ account: toFlowAddress(acc2.address), value: toBigNumber("0.03") }],
		)
		expect(tx.status).toEqual(4)

		// const order = getTestOrderTmplate("bid", tx.orderId, itemId, toBigNumber("0.01"))
		// const updateTx = await acc2.sdk.order.bidUpdate(
		// 	evolutionCollection, "FLOW", order, toBigNumber("2"),
		// )
		// checkEvent(updateTx, "BidAvailable", "RaribleOpenBid")

		// const cancelBidTx = await acc2.sdk.order.cancelBid(evolutionCollection, updateTx.orderId)
		// checkEvent(cancelBidTx, "BidCompleted", "RaribleOpenBid")
	})

	test.skip("Should create/update/cancel MotoGpCard bid order", async () => {
		const motoGpCollection = toFlowContractAddress(EmulatorCollections.MOTOGP)
		const { acc1, acc2, serviceAcc } = await createMotoGpTestEnvironment(fcl)

		const result = await borrowMotoGpCardId(fcl, serviceAcc.address, acc1.address, 1)
		expect(result.cardID).toEqual(1)

		const itemId = toFlowItemId(`${motoGpCollection}:${result.cardID}`)

		const tx = await acc2.sdk.order.bid(
			motoGpCollection,
			"FLOW",
			itemId,
			toBigNumber("1"),
			[{ account: toFlowAddress(acc2.address), value: toBigNumber("0.03") }],
		)
		expect(tx.status).toEqual(4)

		const order = getTestOrderTmplate("bid", tx.orderId, itemId, toBigNumber("0.01"))
		const updateTx = await acc2.sdk.order.bidUpdate(
			motoGpCollection, "FLOW", order, toBigNumber("2"),
		)
		checkEvent(updateTx, "BidAvailable", "RaribleOpenBid")

		const cancelBidTx = await acc2.sdk.order.cancelBid(motoGpCollection, updateTx.orderId)
		checkEvent(cancelBidTx, "BidCompleted", "RaribleOpenBid")
	})
})
