import { createEmulatorAccount, createFlowEmulator, createTestAuth } from "@rarible/flow-test-common"
import fcl from "@onflow/fcl"
import type { FlowSdk } from "../index"
import { createFlowSdk, toFlowContractAddress } from "../index"
import { checkEvent } from "../test/helpers/check-event"
import { EmulatorCollections } from "../config/config"
import { createEvolutionTestEnvironment, getEvolutionIds } from "../test/helpers/emulator/evolution"
import { createTopShotTestEnvironment, getTopShotIds } from "../test/helpers/emulator/top-shot"
import { borrowMotoGpCardId, createMotoGpTestEnvironment } from "../test/helpers/emulator/moto-gp-card"
import { createFusdTestEnvironment } from "../test/helpers/emulator/setup-fusd-env"
import { toFlowItemId } from "../common/item"
import { createMugenArtTestEnvironment, getMugenArtIds } from "../test/helpers/emulator/mugen-art"

describe("Test cancel order on emulator", () => {
	let sdk: FlowSdk
	createFlowEmulator({})
	const collection = toFlowContractAddress(EmulatorCollections.RARIBLE)

	beforeAll(async () => {
		const { address, pk } = await createEmulatorAccount("accountName")
		const auth = createTestAuth(fcl, "emulator", address, pk, 0)
		sdk = createFlowSdk(fcl, "emulator", {}, auth)
	})

	test("Should cancel RaribleNFT order", async () => {
		const mintTx = await sdk.nft.mint(collection, "ipfs://ipfs/QmNe7Hd9xiqm1MXPtQQjVtksvWX6ieq9Wr6kgtqFo9D4CU", [])
		const tx = await sdk.order.sell({
			collection, currency: "FLOW", itemId: mintTx.tokenId, sellItemPrice: "0.1",
		})
		expect(tx.status).toEqual(4)

		const cancelTx = await sdk.order.cancelOrder(collection, tx.orderId)
		checkEvent(cancelTx, "ListingCompleted", "NFTStorefront")
	})

	test("Should cancel RaribleNFT sell order for FUSD", async () => {
		const { acc1 } = await createFusdTestEnvironment(fcl, "emulator")
		const mintTx = await acc1.sdk.nft.mint(
			collection,
			"ipfs://ipfs/QmNe7Hd9xiqm1MXPtQQjVtksvWX6ieq9Wr6kgtqFo9D4CU",
			[],
		)
		const tx = await acc1.sdk.order.sell({
			collection,
			currency: "FUSD",
			itemId: mintTx.tokenId,
			sellItemPrice: "0.1",
		})
		expect(tx.status).toEqual(4)

		const cancelTx = await acc1.sdk.order.cancelOrder(collection, tx.orderId)
		checkEvent(cancelTx, "ListingCompleted", "NFTStorefront")
	})

	test("Should cancel sell order from evolution nft", async () => {
		const evolutionCollection = toFlowContractAddress(EmulatorCollections.EVOLUTION)
		const { acc1, serviceAcc } = await createEvolutionTestEnvironment(fcl)

		const result = await getEvolutionIds(fcl, serviceAcc.address, acc1.address, acc1.tokenId)
		expect(result.data.itemId).toEqual(1)

		const itemId = toFlowItemId(`${evolutionCollection}:1`)

		const sellTx = await acc1.sdk.order.sell({
			collection: evolutionCollection,
			currency: "FLOW",
			itemId,
			sellItemPrice: "0.0001",
		})
		checkEvent(sellTx, "ListingAvailable", "NFTStorefront")

		const cancelTx = await acc1.sdk.order.cancelOrder(evolutionCollection, sellTx.orderId)
		checkEvent(cancelTx, "ListingCompleted", "NFTStorefront")
	})

	test("Should cancel sell order from TopShot nft", async () => {
		const topShotColletion = toFlowContractAddress(EmulatorCollections.TOPSHOT)
		const { acc1, serviceAcc } = await createTopShotTestEnvironment(fcl)

		const [result] = await getTopShotIds(fcl, serviceAcc.address, acc1.address)
		expect(result).toEqual(1)

		const itemId = toFlowItemId(`${topShotColletion}:1`)

		const sellTx = await acc1.sdk.order.sell({
			collection: topShotColletion,
			currency: "FLOW",
			itemId,
			sellItemPrice: "0.0001",
		})
		checkEvent(sellTx, "ListingAvailable", "NFTStorefront")

		const cancelTx = await acc1.sdk.order.cancelOrder(topShotColletion, sellTx.orderId)
		checkEvent(cancelTx, "ListingCompleted", "NFTStorefront")
	})

	test("Should cancel order from MotoCpCard nft", async () => {
		const motoGpColletion = toFlowContractAddress(EmulatorCollections.MOTOGP)
		const { acc1, serviceAcc } = await createMotoGpTestEnvironment(fcl)

		const result = await borrowMotoGpCardId(fcl, serviceAcc.address, acc1.address, 1)
		expect(result.cardID).toEqual(1)

		const itemId = toFlowItemId(`${motoGpColletion}:${result.cardID}`)

		const sellTx = await acc1.sdk.order.sell({
			collection: motoGpColletion,
			currency: "FLOW",
			itemId,
			sellItemPrice: "0.0001",
		})
		checkEvent(sellTx, "ListingAvailable", "NFTStorefront")

		const cancelTx = await acc1.sdk.order.cancelOrder(motoGpColletion, sellTx.orderId)
		checkEvent(cancelTx, "ListingCompleted", "NFTStorefront")
	})

	test("Should cancell sell order, MugenArt nft", async () => {
		const mugenArtCollection = toFlowContractAddress(EmulatorCollections.MUGENNFT)
		const { acc1, serviceAcc } = await createMugenArtTestEnvironment(fcl)

		const [id] = await getMugenArtIds(fcl, serviceAcc.address, acc1.address)
		expect(id).toEqual(0)

		const itemId = toFlowItemId(`${mugenArtCollection}:${id}`)

		const sellTx = await acc1.sdk.order.sell({
			collection: mugenArtCollection,
			currency: "FLOW",
			itemId,
			sellItemPrice: "0.0001",
		})
		checkEvent(sellTx, "ListingAvailable", "NFTStorefront")

		const cancelTx = await acc1.sdk.order.cancelOrder(mugenArtCollection, sellTx.orderId)
		checkEvent(cancelTx, "ListingCompleted", "NFTStorefront")
	})
})
