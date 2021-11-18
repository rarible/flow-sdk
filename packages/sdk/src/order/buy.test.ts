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

describe("Test buy on emulator", () => {
	let sdk: FlowSdk
	createFlowEmulator({})
	const collection = toFlowContractAddress(EmulatorCollections.RARIBLE)

	test("Should buy RaribleNFT order for FLOW tokens", async () => {
		const { address, pk } = await createEmulatorAccount("accountName")
		const auth = createTestAuth(fcl, "emulator", address, pk, 0)
		sdk = createFlowSdk(fcl, "emulator", auth)

		const mintTx = await sdk.nft.mint(collection, "ipfs://ipfs/QmNe7Hd9xiqm1MXPtQQjVtksvWX6ieq9Wr6kgtqFo9D4CU", [])
		expect(mintTx.status).toEqual(4)
		const tx = await sdk.order.sell(collection, "FLOW", mintTx.tokenId, "0.001")
		const { orderId } = tx.events[2].data
		expect(orderId).toBeGreaterThan(0)
		const buyTx = await sdk.order.buy(collection, "FLOW", orderId, address)
		checkEvent(buyTx, "Withdraw")
		checkEvent(buyTx, "Deposit", "RaribleNFT")
	})

	test("Should buy RaribleNFT order for FUSD tokens", async () => {
		const { acc1, acc2 } = await createFusdTestEnvironment(fcl, "emulator")

		const mintTx = await acc1.sdk.nft.mint(collection, "ipfs://ipfs/QmNe7Hd9xiqm1MXPtQQjVtksvWX6ieq9Wr6kgtqFo9D4CU", [])
		expect(mintTx.status).toEqual(4)
		const tx = await acc1.sdk.order.sell(collection, "FUSD", mintTx.tokenId, "0.001")
		const order = extractOrder(tx)

		const buyTx = await acc2.sdk.order.buy(collection, "FUSD", order.orderId, acc1.address)
		checkEvent(buyTx, "Withdraw")
		checkEvent(buyTx, "Deposit", "RaribleNFT")
	})

	test("Should buy an evolution nft", async () => {
		const evolutionCollection = toFlowContractAddress(EmulatorCollections.EVOLUTION)
		const { acc1, acc2, serviceAcc } = await createEvolutionTestEnvironment(fcl)

		const result = await getEvolutionIds(fcl, serviceAcc.address, acc1.address, acc1.tokenId)
		expect(result.data.itemId).toEqual(1)

		const sellTx = await acc1.sdk.order.sell(
			evolutionCollection, "FLOW", 1, "0.0001",
		)
		checkEvent(sellTx, "ListingAvailable", "NFTStorefront")
		checkEvent(sellTx, "OrderAvailable", "RaribleOrder")

		const order = extractOrder(sellTx)
		expect(order.price).toEqual("0.00010000")

		const buyTx = await acc2.sdk.order.buy(evolutionCollection, "FLOW", order.orderId, acc1.address)
		checkEvent(buyTx, "ListingCompleted", "NFTStorefront")
		const checkNft = await getEvolutionIds(fcl, serviceAcc.address, acc2.address, acc1.tokenId)
		expect(checkNft.data.itemId).toEqual(1)
	})

	test("Should buy TopShot nft", async () => {
		const topShotColletion = toFlowContractAddress(EmulatorCollections.TOPSHOT)
		const { acc1, acc2, serviceAcc } = await createTopShotTestEnvironment(fcl)

		const [result] = await getTopShotIds(fcl, serviceAcc.address, acc1.address)
		expect(result).toEqual(1)

		const sellTx = await acc1.sdk.order.sell(
			topShotColletion, "FLOW", result, "0.0001",
		)
		checkEvent(sellTx, "ListingAvailable", "NFTStorefront")
		checkEvent(sellTx, "OrderAvailable", "RaribleOrder")

		const order = extractOrder(sellTx)
		expect(order.price).toEqual("0.00010000")

		const buyTx = await acc2.sdk.order.buy(topShotColletion, "FLOW", order.orderId, acc1.address)
		checkEvent(buyTx, "ListingCompleted", "NFTStorefront")
		const [checkNft] = await getTopShotIds(fcl, serviceAcc.address, acc2.address)
		expect(checkNft).toEqual(1)
	})

	test("Should buy MotoCpCard nft", async () => {
		const motoGpColletion = toFlowContractAddress(EmulatorCollections.MOTOGP)
		const { acc1, acc2, serviceAcc } = await createMotoGpTestEnvironment(fcl)

		const result = await borrowMotoGpCardId(fcl, serviceAcc.address, acc1.address, 1)
		expect(result.cardID).toEqual(1)

		const sellTx = await acc1.sdk.order.sell(motoGpColletion, "FLOW", result.cardID, "0.0001")
		checkEvent(sellTx, "ListingAvailable", "NFTStorefront")
		checkEvent(sellTx, "OrderAvailable", "RaribleOrder")

		const order = extractOrder(sellTx)
		expect(order.price).toEqual("0.00010000")

		const buyTx = await acc2.sdk.order.buy(motoGpColletion, "FLOW", order.orderId, acc1.address)
		checkEvent(buyTx, "ListingCompleted", "NFTStorefront")
		const buyResult = await borrowMotoGpCardId(fcl, serviceAcc.address, acc2.address, 1)
		expect(buyResult.cardID).toEqual(1)
	})
})
