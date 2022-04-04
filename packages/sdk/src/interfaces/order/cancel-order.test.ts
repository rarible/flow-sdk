import { createEmulatorAccount, createFlowEmulator, createTestAuth } from "@rarible/flow-test-common"
import fcl from "@onflow/fcl"
import type { FlowSdk } from "../../index"
import { createFlowSdk } from "../../index"
import { checkEvent } from "../../test/check-event"
import { createEvolutionTestEnvironment, getEvolutionIds } from "../../test/secondary-collections/evolution"
import { createTopShotTestEnvironment, getTopShotIds } from "../../test/secondary-collections/top-shot"
import { borrowMotoGpCardId, createMotoGpTestEnvironment } from "../../test/secondary-collections/moto-gp-card"
import { createFusdTestEnvironment } from "../../test/setup-fusd-env"
import { toFlowItemId } from "../../types/item"
import { createMugenArtTestEnvironment, getMugenArtIds } from "../../test/secondary-collections/mugen-art"
import { getContractAddress } from "../../config/utils"
import { mintTest } from "../test/mint-test"
import { sellTest } from "../test/sell-test"

describe("Test cancel order on emulator", () => {
	let sdk: FlowSdk
	createFlowEmulator({})
	const collection = getContractAddress("emulator", "RaribleNFT")

	beforeAll(async () => {
		const { address, pk } = await createEmulatorAccount("accountName")
		const auth = createTestAuth(fcl, "emulator", address, pk, 0)
		sdk = createFlowSdk(fcl, "emulator", {}, auth)
	})

	test("Should cancel RaribleNFT order", async () => {
		const mintTx = await mintTest(sdk, collection)
		const tx = await sellTest(fcl, sdk, "emulator", collection, "FLOW", mintTx.tokenId, "0.1")

		const cancelTx = await sdk.order.cancelOrder(collection, tx.orderId)
		checkEvent(cancelTx, "ListingCompleted", "NFTStorefront")
	})

	test("Should cancel RaribleNFT sell order for FUSD", async () => {
		const { acc1 } = await createFusdTestEnvironment(fcl, "emulator")
		const mintTx = await mintTest(acc1.sdk, collection)
		const tx = await sellTest(fcl, acc1.sdk, "emulator", collection, "FUSD", mintTx.tokenId, "0.1")

		const cancelTx = await acc1.sdk.order.cancelOrder(collection, tx.orderId)
		checkEvent(cancelTx, "ListingCompleted", "NFTStorefront")
	})

	test("Should cancel sell order from evolution nft", async () => {
		const evolutionCollection = getContractAddress("emulator", "Evolution")
		const { acc1, serviceAcc } = await createEvolutionTestEnvironment(fcl)

		const result = await getEvolutionIds(fcl, serviceAcc.address, acc1.address, acc1.tokenId)
		expect(result.data.itemId).toEqual(1)

		const itemId = toFlowItemId(`${evolutionCollection}:1`)

		const sellTx = await sellTest(
			fcl, acc1.sdk, "emulator", evolutionCollection, "FLOW", itemId, "0.0001",
		)

		const cancelTx = await acc1.sdk.order.cancelOrder(evolutionCollection, sellTx.orderId)
		checkEvent(cancelTx, "ListingCompleted", "NFTStorefront")
	})

	test("Should cancel sell order from TopShot nft", async () => {
		const topShotColletion = getContractAddress("emulator", "TopShot")
		const { acc1, serviceAcc } = await createTopShotTestEnvironment(fcl)

		const [result] = await getTopShotIds(fcl, serviceAcc.address, acc1.address)
		expect(result).toEqual(1)

		const itemId = toFlowItemId(`${topShotColletion}:1`)

		const sellTx = await sellTest(
			fcl, acc1.sdk, "emulator", topShotColletion, "FLOW", itemId, "0.0001",
		)

		const cancelTx = await acc1.sdk.order.cancelOrder(topShotColletion, sellTx.orderId)
		checkEvent(cancelTx, "ListingCompleted", "NFTStorefront")
	})

	test("Should cancel order from MotoCpCard nft", async () => {
		const motoGpColletion = getContractAddress("emulator", "MotoGPCard")
		const { acc1, serviceAcc } = await createMotoGpTestEnvironment(fcl)

		const result = await borrowMotoGpCardId(fcl, serviceAcc.address, acc1.address, 1)
		expect(result.cardID).toEqual(1)

		const itemId = toFlowItemId(`${motoGpColletion}:${result.cardID}`)

		const sellTx = await sellTest(
			fcl, acc1.sdk, "emulator", motoGpColletion, "FLOW", itemId, "0.0001",
		)

		const cancelTx = await acc1.sdk.order.cancelOrder(motoGpColletion, sellTx.orderId)
		checkEvent(cancelTx, "ListingCompleted", "NFTStorefront")
	})

	test("Should cancell sell order, MugenArt nft", async () => {
		const mugenArtCollection = getContractAddress("emulator", "MugenNFT")
		const { acc1, serviceAcc } = await createMugenArtTestEnvironment(fcl)

		const [id] = await getMugenArtIds(fcl, serviceAcc.address, acc1.address)
		expect(id).toEqual(0)

		const itemId = toFlowItemId(`${mugenArtCollection}:${id}`)

		const sellTx = await sellTest(
			fcl, acc1.sdk, "emulator", mugenArtCollection, "FLOW", itemId, "0.0001",
		)

		const cancelTx = await acc1.sdk.order.cancelOrder(mugenArtCollection, sellTx.orderId)
		checkEvent(cancelTx, "ListingCompleted", "NFTStorefront")
	})
})