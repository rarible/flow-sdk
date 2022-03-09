import {
	createFlowEmulator,
	createTestAuth,
	FLOW_TESTNET_ACCOUNT_2,
	FLOW_TESTNET_ACCOUNT_3,
} from "@rarible/flow-test-common"
import fcl from "@onflow/fcl"
import { toBigNumber, toFlowAddress } from "@rarible/types"
import { checkEvent } from "../../test/check-event"
import { createEvolutionTestEnvironment, getEvolutionIds } from "../../test/secondary-collections/evolution"
import { createTopShotTestEnvironment, getTopShotIds } from "../../test/secondary-collections/top-shot"
import { borrowMotoGpCardId, createMotoGpTestEnvironment } from "../../test/secondary-collections/moto-gp-card"
import { createFusdTestEnvironment } from "../../test/setup-fusd-env"
import { toFlowItemId } from "../../types/item"
import { getTestOrderTmplate } from "../../test/order-template"
import { createFlowSdk } from "../../index"
import { createMugenArtTestEnvironment, getMugenArtIds } from "../../test/secondary-collections/mugen-art"
import { getContractAddress } from "../../config/utils"
import { mintTest } from "../test/mint-test"
import { sellTest } from "../test/sell-test"
import { createFlowTestEmulatorSdk } from "../../test/create-flow-test-sdk"
import { updateOrderTest } from "../test/update-order-test"

describe("Test update sell order on emulator", () => {
	createFlowEmulator({})
	const collection = getContractAddress("emulator", "RaribleNFT")

	test.skip("Should update RaribleNFT sell order on testnet", async () => {
		const testnetAuth = createTestAuth(fcl, "testnet", FLOW_TESTNET_ACCOUNT_3.address, FLOW_TESTNET_ACCOUNT_3.privKey)
		const testnetSdk = createFlowSdk(fcl, "dev", {}, testnetAuth)
		const testnetCollection = getContractAddress("testnet", "RaribleNFT")
		const royalties = [{ account: toFlowAddress(FLOW_TESTNET_ACCOUNT_3.address), value: toBigNumber("0.1") }]
		const mintTx = await mintTest(testnetSdk, testnetCollection, royalties)
		const orderTx = await testnetSdk.order.sell({
			collection: testnetCollection,
			currency: "FLOW",
			itemId: mintTx.tokenId,
			sellItemPrice: "1",
			originFees: [{ account: toFlowAddress(FLOW_TESTNET_ACCOUNT_2.address), value: toBigNumber("0.05") }],
		})

		const updateTx = await testnetSdk.order.updateOrder({
			collection, currency: "FLOW", order: orderTx.orderId, sellItemPrice: toBigNumber("0.2"),
		})
		checkEvent(updateTx, "ListingAvailable", "NFTStorefront")
	}, 1000000)

	test("Should update RaribleNFT sell order", async () => {
		const { sdk } = await createFlowTestEmulatorSdk("accountName")
		const mintTx = await mintTest(sdk, collection)

		const tx = await sellTest(fcl, sdk, "emulator", collection, "FLOW", mintTx.tokenId, "0.1")

		const order = getTestOrderTmplate("sell", tx.orderId, mintTx.tokenId, toBigNumber("0.1"))
		await updateOrderTest(fcl, "emulator", sdk, collection, order, "0.2")
	})

	test("Should update RaribleNFT sell FUSD order", async () => {
		const { acc1 } = await createFusdTestEnvironment(fcl, "emulator")
		const mintTx = await mintTest(acc1.sdk, collection)
		const tx = await sellTest(fcl, acc1.sdk, "emulator", collection, "FUSD", mintTx.tokenId, "0.1")
		const order = getTestOrderTmplate("sell", tx.orderId, mintTx.tokenId, toBigNumber("0.1"))
		const updatedOrderTx = await updateOrderTest(fcl, "emulator", acc1.sdk, collection, order, "0.2")
		const order2 = getTestOrderTmplate("sell", updatedOrderTx.orderId, mintTx.tokenId, toBigNumber("0.2"))
		await updateOrderTest(fcl, "emulator", acc1.sdk, collection, order2, "0.3", "FLOW")
	})

	test("Should update sell order from evolution nft", async () => {
		const evolutionCollection = getContractAddress("emulator", "Evolution")
		const { acc1, serviceAcc } = await createEvolutionTestEnvironment(fcl)

		const result = await getEvolutionIds(fcl, serviceAcc.address, acc1.address, acc1.tokenId)
		expect(result.data.itemId).toEqual(1)

		const itemId = toFlowItemId(`${evolutionCollection}:1`)
		const sellTx = await sellTest(
			fcl, acc1.sdk, "emulator", evolutionCollection, "FLOW", itemId, "0.0001",
		)

		const order = getTestOrderTmplate("sell", sellTx.orderId, itemId, toBigNumber("0.0001"))
		await updateOrderTest(fcl, "emulator", acc1.sdk, evolutionCollection, order, "0.0002", "FLOW")
	})

	test("Should update sell order from TopShot nft", async () => {
		const topShotColletion = getContractAddress("emulator", "TopShot")
		const { acc1, serviceAcc } = await createTopShotTestEnvironment(fcl)

		const [result] = await getTopShotIds(fcl, serviceAcc.address, acc1.address)
		expect(result).toEqual(1)

		const itemId = toFlowItemId(`${topShotColletion}:${result}`)

		const sellTx = await sellTest(
			fcl, acc1.sdk, "emulator", topShotColletion, "FLOW", itemId, "0.0001",
		)

		const order = getTestOrderTmplate("sell", sellTx.orderId, itemId, toBigNumber("0.0001"))
		await updateOrderTest(fcl, "emulator", acc1.sdk, topShotColletion, order, "0.0002", "FLOW")
	})

	test("Should update order from MotoCpCard nft", async () => {
		const motoGpColletion = getContractAddress("emulator", "MotoGPCard")
		const { acc1, serviceAcc } = await createMotoGpTestEnvironment(fcl)

		const result = await borrowMotoGpCardId(fcl, serviceAcc.address, acc1.address, 1)
		expect(result.cardID).toEqual(1)

		const itemId = toFlowItemId(`${motoGpColletion}:${result.cardID}`)

		const sellTx = await sellTest(
			fcl, acc1.sdk, "emulator", motoGpColletion, "FLOW", itemId, "0.0001",
		)

		const order = getTestOrderTmplate("sell", sellTx.orderId, itemId, toBigNumber("0.0001"))
		await updateOrderTest(fcl, "emulator", acc1.sdk, motoGpColletion, order, "0.0002", "FLOW")
	})

	test("Should update sell order, MugenArt nft", async () => {
		const mugenArtCollection = getContractAddress("emulator", "MugenNFT")
		const { acc1, serviceAcc } = await createMugenArtTestEnvironment(fcl)

		const [id] = await getMugenArtIds(fcl, serviceAcc.address, acc1.address)
		expect(id).toEqual(0)

		const itemId = toFlowItemId(`${mugenArtCollection}:${id}`)

		const sellTx = await sellTest(
			fcl, acc1.sdk, "emulator", mugenArtCollection, "FLOW", itemId, "0.0001",
		)

		const order = getTestOrderTmplate("sell", sellTx.orderId, itemId, toBigNumber("0.0001"))
		await updateOrderTest(fcl, "emulator", acc1.sdk, mugenArtCollection, order, "0.0002", "FLOW")
	})
})
