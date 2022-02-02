import {
	createEmulatorAccount,
	createFlowEmulator,
	createTestAuth,
	FLOW_TESTNET_ACCOUNT_2,
	FLOW_TESTNET_ACCOUNT_3,
} from "@rarible/flow-test-common"
import fcl from "@onflow/fcl"
import { toBigNumber, toFlowAddress } from "@rarible/types"
import { checkEvent } from "../test/check-event"
import { createEvolutionTestEnvironment, getEvolutionIds } from "../test/secondary-collections/evolution"
import { createTopShotTestEnvironment, getTopShotIds } from "../test/secondary-collections/top-shot"
import { borrowMotoGpCardId, createMotoGpTestEnvironment } from "../test/secondary-collections/moto-gp-card"
import { createFusdTestEnvironment } from "../test/setup-fusd-env"
import { toFlowItemId } from "../common/item"
import { getTestOrderTmplate } from "../test/order-template"
import { createFlowSdk } from "../index"
import { createMugenArtTestEnvironment, getMugenArtIds } from "../test/secondary-collections/mugen-art"
import { getCollectionId } from "../config/config"

describe("Test update sell order on emulator", () => {
	createFlowEmulator({})
	const collection = getCollectionId("emulator", "RaribleNFT")

	test.skip("Should update RaribleNFT sell order on testnet", async () => {
		const testnetAuth = createTestAuth(fcl, "testnet", FLOW_TESTNET_ACCOUNT_3.address, FLOW_TESTNET_ACCOUNT_3.privKey)
		const testnetSdk = createFlowSdk(fcl, "dev", {}, testnetAuth)
		const testnetCollection = getCollectionId("testnet", "RaribleNFT")
		const mintTx = await testnetSdk.nft.mint(
			testnetCollection,
			"ipfs://ipfs/QmNe7Hd9xiqm1MXPtQQjVtksvWX6ieq9Wr6kgtqFo9D4CU",
			[{ account: toFlowAddress(FLOW_TESTNET_ACCOUNT_3.address), value: toBigNumber("0.1") }],
		)
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
		const { address, pk } = await createEmulatorAccount("accountName")
		const auth = createTestAuth(fcl, "emulator", address, pk, 0)
		const sdk = createFlowSdk(fcl, "emulator", {}, auth)
		const mintTx = await sdk.nft.mint(
			collection,
			"ipfs://ipfs/QmNe7Hd9xiqm1MXPtQQjVtksvWX6ieq9Wr6kgtqFo9D4CU",
			[],
		)
		const tx = await sdk.order.sell({
			collection,
			currency: "FLOW",
			itemId: mintTx.tokenId,
			sellItemPrice: "0.1",
		})
		checkEvent(tx, "ListingAvailable", "NFTStorefront")
		const order = getTestOrderTmplate("sell", tx.orderId, mintTx.tokenId, toBigNumber("0.1"))
		const updateTx = await sdk.order.updateOrder({
			collection, currency: "FLOW", order, sellItemPrice: toBigNumber("0.2"),
		})
		checkEvent(updateTx, "ListingAvailable", "NFTStorefront")
	})

	test("Should update RaribleNFT sell FUSD order", async () => {
		const { acc1 } = await createFusdTestEnvironment(fcl, "emulator")
		const mintTx = await acc1.sdk.nft.mint(
			collection,
			"ipfs://ipfs/QmNe7Hd9xiqm1MXPtQQjVtksvWX6ieq9Wr6kgtqFo9D4CU",
			[],
		)
		const tx = await acc1.sdk.order.sell({
			collection,
			currency: "FLOW",
			itemId: mintTx.tokenId,
			sellItemPrice: "0.1",
		})
		checkEvent(tx, "ListingAvailable", "NFTStorefront")
		const order = getTestOrderTmplate("sell", tx.orderId, mintTx.tokenId, toBigNumber("0.1"))
		const updateTx = await acc1.sdk.order.updateOrder({
			collection, currency: "FLOW", order, sellItemPrice: toBigNumber("0.2"),
		})
		checkEvent(updateTx, "ListingAvailable", "NFTStorefront")
	})

	test("Should update sell order from evolution nft", async () => {
		const evolutionCollection = getCollectionId("emulator", "Evolution")
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
		const order = getTestOrderTmplate("sell", sellTx.orderId, itemId, toBigNumber("0.0001"))
		const updateTx = await acc1.sdk.order.updateOrder({
			collection: evolutionCollection, currency: "FLOW", order, sellItemPrice: toBigNumber("0.0002"),
		})
		checkEvent(updateTx, "ListingAvailable", "NFTStorefront")
	})

	test("Should update sell order from TopShot nft", async () => {
		const topShotColletion = getCollectionId("emulator", "TopShot")
		const { acc1, serviceAcc } = await createTopShotTestEnvironment(fcl)

		const [result] = await getTopShotIds(fcl, serviceAcc.address, acc1.address)
		expect(result).toEqual(1)

		const itemId = toFlowItemId(`${topShotColletion}:${result}`)

		const sellTx = await acc1.sdk.order.sell({
			collection: topShotColletion,
			currency: "FLOW",
			itemId,
			sellItemPrice: "0.0001",
		})
		checkEvent(sellTx, "ListingAvailable", "NFTStorefront")

		const order = getTestOrderTmplate("sell", sellTx.orderId, itemId, toBigNumber("0.0001"))
		const updateTx = await acc1.sdk.order.updateOrder({
			collection: topShotColletion,
			currency: "FLOW",
			order,
			sellItemPrice: toBigNumber("0.0002"),
		})
		checkEvent(updateTx, "ListingAvailable", "NFTStorefront")
	})

	test("Should update order from MotoCpCard nft", async () => {
		const motoGpColletion = getCollectionId("emulator", "MotoGPCard")
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

		const order = getTestOrderTmplate("sell", sellTx.orderId, itemId, toBigNumber("0.0001"))
		const updateTx = await acc1.sdk.order.updateOrder({
			collection: motoGpColletion,
			currency: "FLOW",
			order,
			sellItemPrice: toBigNumber("0.001"),
		})
		checkEvent(updateTx, "ListingAvailable", "NFTStorefront")
	})

	test("Should update sell order, MugenArt nft", async () => {
		const mugenArtCollection = getCollectionId("emulator", "MugenNFT")
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

		const order = getTestOrderTmplate("sell", sellTx.orderId, itemId, toBigNumber("0.0001"))
		const updateTx = await acc1.sdk.order.updateOrder({
			collection: mugenArtCollection,
			currency: "FLOW",
			order,
			sellItemPrice: toBigNumber("0.001"),
		})
		checkEvent(updateTx, "ListingAvailable", "NFTStorefront")
	})
})
