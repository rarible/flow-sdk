import { createTestAuth } from "@rarible/flow-test-common"
import fcl from "@onflow/fcl"
import { createEmulatorAccount, createFlowEmulator } from "@rarible/flow-test-common/src"
import type { FlowSdk } from "../index"
import { createFlowSdk } from "../index"
import { checkEvent } from "../test/check-event"
import { EmulatorCollections } from "../config"
import { toFlowContractAddress } from "../common/flow-address"
import { createEvolutionTestEnvironment, getEvolutionIds } from "../test/evolution"
import { extractOrder } from "../test/extract-order"
import { createTopShotTestEnvironment, getTopShotIds } from "../test/top-shot"
import { borrowMotoGpCardId, createMotoGpTestEnvironment } from "../test/moto-gp-card"
import { createFusdTestEnvironment } from "../test/setup-fusd-env"

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

	test("Should cancel RaribleNFT sell order for FUSD", async () => {
		const { acc1 } = await createFusdTestEnvironment(fcl, "emulator")
		const mintTx = await acc1.sdk.nft.mint(
			collection,
			"ipfs://ipfs/QmNe7Hd9xiqm1MXPtQQjVtksvWX6ieq9Wr6kgtqFo9D4CU",
			[],
		)
		const tx = await acc1.sdk.order.sell(collection, "FUSD", mintTx.tokenId, "0.1")
		const order = extractOrder(tx)
		expect(tx.status).toEqual(4)
		const cancelTx = await acc1.sdk.order.cancelOrder(collection, order.orderId)
		checkEvent(cancelTx, "ListingCompleted", "NFTStorefront")
	})

	test("Should cancel sell order from evolution nft", async () => {
		const evolutionCollection = toFlowContractAddress(EmulatorCollections.EVOLUTION)
		const { acc1, serviceAcc } = await createEvolutionTestEnvironment(fcl)

		const result = await getEvolutionIds(fcl, serviceAcc.address, acc1.address, acc1.tokenId)
		expect(result.data.itemId).toEqual(1)

		const sellTx = await acc1.sdk.order.sell(
			evolutionCollection, "FLOW", 1, "0.000001",
		)
		checkEvent(sellTx, "ListingAvailable", "NFTStorefront")
		checkEvent(sellTx, "OrderAvailable", "RaribleOrder")

		const order = extractOrder(sellTx)
		expect(order.price).toEqual("0.00000100")

		const cancelTx = await acc1.sdk.order.cancelOrder(evolutionCollection, order.orderId)
		checkEvent(cancelTx, "ListingCompleted", "NFTStorefront")
	})

	test("Should cancel sell order from TopShot nft", async () => {
		const topShotColletion = toFlowContractAddress(EmulatorCollections.TOPSHOT)
		const { acc1, serviceAcc } = await createTopShotTestEnvironment(fcl)

		const [result] = await getTopShotIds(fcl, serviceAcc.address, acc1.address)
		expect(result).toEqual(1)

		const sellTx = await acc1.sdk.order.sell(
			topShotColletion, "FLOW", 1, "0.000001",
		)
		checkEvent(sellTx, "ListingAvailable", "NFTStorefront")
		checkEvent(sellTx, "OrderAvailable", "RaribleOrder")

		const order = extractOrder(sellTx)
		expect(order.price).toEqual("0.00000100")

		const cancelTx = await acc1.sdk.order.cancelOrder(topShotColletion, order.orderId)
		checkEvent(cancelTx, "ListingCompleted", "NFTStorefront")
	})

	test("Should cancel order from MotoCpCard nft", async () => {
		const motoGpColletion = toFlowContractAddress(EmulatorCollections.MOTOGP)
		const { acc1, serviceAcc } = await createMotoGpTestEnvironment(fcl)

		const result = await borrowMotoGpCardId(fcl, serviceAcc.address, acc1.address, 1)
		expect(result.cardID).toEqual(1)

		const sellTx = await acc1.sdk.order.sell(motoGpColletion, "FLOW", result.cardID, "0.0001")
		checkEvent(sellTx, "ListingAvailable", "NFTStorefront")
		checkEvent(sellTx, "OrderAvailable", "RaribleOrder")

		const order = extractOrder(sellTx)
		expect(order.price).toEqual("0.00010000")

		const cancelTx = await acc1.sdk.order.cancelOrder(motoGpColletion, order.orderId)
		checkEvent(cancelTx, "ListingCompleted", "NFTStorefront")
	})
})
