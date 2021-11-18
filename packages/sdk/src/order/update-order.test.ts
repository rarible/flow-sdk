import { createTestAuth } from "@rarible/flow-test-common"
import fcl from "@onflow/fcl"
import { createEmulatorAccount, createFlowEmulator } from "@rarible/flow-test-common/src"
import type { FlowSdk } from "../index"
import { createFlowSdk } from "../index"
import { EmulatorCollections } from "../config"
import { extractOrder } from "../test/extract-order"
import { checkEvent } from "../test/check-event"
import { toFlowContractAddress } from "../common/flow-address"
import { createEvolutionTestEnvironment, getEvolutionIds } from "../test/evolution"
import { createTopShotTestEnvironment, getTopShotIds } from "../test/top-shot"
import { borrowMotoGpCardId, createMotoGpTestEnvironment } from "../test/moto-gp-card"
import { createFusdTestEnvironment } from "../test/setup-fusd-env"

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

	test("Should update RaribleNFT sell FUSD order", async () => {
		const { acc1 } = await createFusdTestEnvironment(fcl, "emulator")
		const mintTx = await acc1.sdk.nft.mint(
			collection,
			"ipfs://ipfs/QmNe7Hd9xiqm1MXPtQQjVtksvWX6ieq9Wr6kgtqFo9D4CU",
			[],
		)
		const tx = await acc1.sdk.order.sell(collection, "FUSD", mintTx.tokenId, "0.1")
		checkEvent(tx, "ListingAvailable", "NFTStorefront")
		checkEvent(tx, "OrderAvailable", "RaribleOrder")
		const order = extractOrder(tx)
		expect(order.price).toEqual("0.10000000")

		const updateTx = await acc1.sdk.order.updateOrder(collection, "FLOW", order.orderId, "0.2")
		const updatedOrder = extractOrder(updateTx)
		expect(updatedOrder.price).toEqual("0.20000000")
		expect(updatedOrder.vaultType).toEqual("FlowToken")
	})

	test("Should update sell order from evolution nft", async () => {
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

		const updateTx = await acc1.sdk.order.updateOrder(evolutionCollection, "FLOW", order.orderId, "0.00000002")
		const updatedOrder = extractOrder(updateTx)
		expect(updatedOrder.price).toEqual("0.00000002")
	})

	test("Should update sell order from TopShot nft", async () => {
		const topShotColletion = toFlowContractAddress(EmulatorCollections.TOPSHOT)
		const { acc1, serviceAcc } = await createTopShotTestEnvironment(fcl)

		const [result] = await getTopShotIds(fcl, serviceAcc.address, acc1.address)
		expect(result).toEqual(1)

		const sellTx = await acc1.sdk.order.sell(
			topShotColletion, "FLOW", result, "0.000001",
		)
		checkEvent(sellTx, "ListingAvailable", "NFTStorefront")
		checkEvent(sellTx, "OrderAvailable", "RaribleOrder")

		const order = extractOrder(sellTx)
		expect(order.price).toEqual("0.00000100")

		const updateTx = await acc1.sdk.order.updateOrder(topShotColletion, "FLOW", order.orderId, "0.00000002")
		const updatedOrder = extractOrder(updateTx)
		expect(updatedOrder.price).toEqual("0.00000002")
	})

	test("Should update order from MotoCpCard nft", async () => {
		const motoGpColletion = toFlowContractAddress(EmulatorCollections.MOTOGP)
		const { acc1, serviceAcc } = await createMotoGpTestEnvironment(fcl)

		const result = await borrowMotoGpCardId(fcl, serviceAcc.address, acc1.address, 1)
		expect(result.cardID).toEqual(1)

		const sellTx = await acc1.sdk.order.sell(motoGpColletion, "FLOW", result.cardID, "0.0001")
		checkEvent(sellTx, "ListingAvailable", "NFTStorefront")
		checkEvent(sellTx, "OrderAvailable", "RaribleOrder")

		const order = extractOrder(sellTx)
		expect(order.price).toEqual("0.00010000")

		const updateTx = await acc1.sdk.order.updateOrder(motoGpColletion, "FLOW", order.orderId, "0.001")
		const updatedOrder = extractOrder(updateTx)
		expect(updatedOrder.price).toEqual("0.00100000")
	})
})
