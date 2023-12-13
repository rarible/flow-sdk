import {
	createEmulatorAccount,
	createFlowEmulator,
	createTestAuth,
	FLOW_TESTNET_ACCOUNT_2,
	FLOW_TESTNET_ACCOUNT_3,
} from "@rarible/flow-test-common"
import * as fcl from "@onflow/fcl"
import { toBigNumber, toFlowAddress } from "@rarible/types"
import { FLOW_TESTNET_ACCOUNT_5 } from "@rarible/flow-test-common"
import { EmulatorCollections, TestnetCollections } from "../config/config"
import { checkEvent } from "../test/helpers/check-event"
import { createEvolutionTestEnvironment, getEvolutionIds } from "../test/helpers/emulator/evolution"
import { createTopShotTestEnvironment, getTopShotIds } from "../test/helpers/emulator/top-shot"
import { borrowMotoGpCardId, createMotoGpTestEnvironment } from "../test/helpers/emulator/moto-gp-card"
import { createFusdTestEnvironment } from "../test/helpers/emulator/setup-fusd-env"
import { toFlowItemId } from "../common/item"
import { getTestOrderTmplate } from "../test/helpers/order-template"
import { createFlowSdk, toFlowContractAddress } from "../index"
import { createMugenArtTestEnvironment, getMugenArtIds } from "../test/helpers/emulator/mugen-art"
import { awaitOrder } from "./common/await-order"

describe("Test update sell order on emulator", () => {
	createFlowEmulator({})
	const collection = toFlowContractAddress(EmulatorCollections.RARIBLE)

	test("Should update RaribleNFT sell order on testnet", async () => {
		const testnetAuth = createTestAuth(fcl, "testnet", FLOW_TESTNET_ACCOUNT_3.address, FLOW_TESTNET_ACCOUNT_3.privKey)
		const testnetSdk = createFlowSdk(fcl, "testnet", {}, testnetAuth)
		const testnetCollection = toFlowContractAddress(TestnetCollections.RARIBLE)
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
		const order = getTestOrderTmplate("sell", sellTx.orderId, itemId, toBigNumber("0.0001"))
		const updateTx = await acc1.sdk.order.updateOrder({
			collection: evolutionCollection, currency: "FLOW", order, sellItemPrice: toBigNumber("0.0002"),
		})
		checkEvent(updateTx, "ListingAvailable", "NFTStorefront")
	})

	test("Should update sell order from TopShot nft", async () => {
		const topShotColletion = toFlowContractAddress(EmulatorCollections.TOPSHOT)
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

describe("Mattel storefront order change testing", () => {

	test("Should update sell Mattel order, HWGaragePack", async () => {
		const testnetAuth = createTestAuth(fcl, "testnet", FLOW_TESTNET_ACCOUNT_5.address, FLOW_TESTNET_ACCOUNT_5.privKey)
		const testnetSdk = createFlowSdk(fcl, "testnet", {}, testnetAuth)

		const testnetCollection = toFlowContractAddress(TestnetCollections.HWGaragePack)
		const tokenId = 30
		const itemId = toFlowItemId(`${testnetCollection}:${tokenId}`)

		const orderTx = await testnetSdk.order.sell({
			collection: testnetCollection,
			currency: "FLOW",
			itemId: itemId,
			sellItemPrice: "99.99",
		})

		const order = await awaitOrder(testnetSdk, orderTx.orderId)
		const updateTx = await testnetSdk.order.updateOrder({
			collection: testnetCollection,
			currency: "FLOW",
			order,
			sellItemPrice: toBigNumber("0.001"),
		})
		checkEvent(updateTx, "ListingAvailable", "NFTStorefrontV2")
	}, 1000000)

	test("Should update sell Mattel order, HWGaragePackV2", async () => {
		const testnetAuth = createTestAuth(fcl, "testnet", FLOW_TESTNET_ACCOUNT_5.address, FLOW_TESTNET_ACCOUNT_5.privKey)
		const testnetSdk = createFlowSdk(fcl, "testnet", {}, testnetAuth)

		const testnetCollection = toFlowContractAddress(TestnetCollections.HWGaragePackV2)
		const tokenId = 1
		const itemId = toFlowItemId(`${testnetCollection}:${tokenId}`)

		const orderTx = await testnetSdk.order.sell({
			collection: testnetCollection,
			currency: "FLOW",
			itemId: itemId,
			sellItemPrice: "99.99",
		})

		const order = await awaitOrder(testnetSdk, orderTx.orderId)
		const updateTx = await testnetSdk.order.updateOrder({
			collection: testnetCollection,
			currency: "FLOW",
			order,
			sellItemPrice: toBigNumber("0.001"),
		})
		checkEvent(updateTx, "ListingAvailable", "NFTStorefrontV2")
	}, 1000000)

	test("Should update sell Mattel order, HWGarageCard", async () => {
		const testnetAuth = createTestAuth(fcl, "testnet", FLOW_TESTNET_ACCOUNT_5.address, FLOW_TESTNET_ACCOUNT_5.privKey)
		const testnetSdk = createFlowSdk(fcl, "testnet", {}, testnetAuth)

		const testnetCollection = toFlowContractAddress(TestnetCollections.HWGarageCard)
		const tokenId = "155"
		const itemId = toFlowItemId(`${testnetCollection}:${tokenId}`)

		const orderTx = await testnetSdk.order.sell({
			collection: testnetCollection,
			currency: "FLOW",
			itemId: itemId,
			sellItemPrice: "1",
		})

		const order = await awaitOrder(testnetSdk, orderTx.orderId)
		const updateTx = await testnetSdk.order.updateOrder({
			collection: testnetCollection,
			currency: "FLOW",
			order,
			sellItemPrice: toBigNumber("0.001"),
		})
		checkEvent(updateTx, "ListingAvailable", "NFTStorefrontV2")
	}, 1000000)

	test("Should update sell Mattel order, HWGarageCardV2", async () => {
		const testnetAuth = createTestAuth(fcl, "testnet", FLOW_TESTNET_ACCOUNT_5.address, FLOW_TESTNET_ACCOUNT_5.privKey)
		const testnetSdk = createFlowSdk(fcl, "testnet", {}, testnetAuth)

		const testnetCollection = toFlowContractAddress(TestnetCollections.HWGarageCardV2)
		const tokenId = "27"
		const itemId = toFlowItemId(`${testnetCollection}:${tokenId}`)

		const orderTx = await testnetSdk.order.sell({
			collection: testnetCollection,
			currency: "FLOW",
			itemId: itemId,
			sellItemPrice: "1",
		})

		const order = await awaitOrder(testnetSdk, orderTx.orderId)
		const updateTx = await testnetSdk.order.updateOrder({
			collection: testnetCollection,
			currency: "FLOW",
			order,
			sellItemPrice: toBigNumber("0.001"),
		})
		checkEvent(updateTx, "ListingAvailable", "NFTStorefrontV2")
	}, 1000000)

	test("Should update sell Mattel order, BarbieCard", async () => {
		const testnetAuth = createTestAuth(fcl, "testnet", FLOW_TESTNET_ACCOUNT_5.address, FLOW_TESTNET_ACCOUNT_5.privKey)
		const testnetSdk = createFlowSdk(fcl, "testnet", {}, testnetAuth)

		const testnetCollection = toFlowContractAddress(TestnetCollections.BBxBarbieCard)
		const tokenId = "13"
		const itemId = toFlowItemId(`${testnetCollection}:${tokenId}`)

		const orderTx = await testnetSdk.order.sell({
			collection: testnetCollection,
			currency: "FLOW",
			itemId: itemId,
			sellItemPrice: "1",
		})

		const order = await awaitOrder(testnetSdk, orderTx.orderId)
		const updateTx = await testnetSdk.order.updateOrder({
			collection: testnetCollection,
			currency: "FLOW",
			order,
			sellItemPrice: toBigNumber("0.001"),
		})
		checkEvent(updateTx, "ListingAvailable", "NFTStorefrontV2")
	}, 1000000)

	test("Should update sell Mattel order, BarbiePack", async () => {
		const testnetAuth = createTestAuth(fcl, "testnet", FLOW_TESTNET_ACCOUNT_5.address, FLOW_TESTNET_ACCOUNT_5.privKey)
		const testnetSdk = createFlowSdk(fcl, "testnet", {}, testnetAuth)

		const testnetCollection = toFlowContractAddress(TestnetCollections.BBxBarbieCard)
		const tokenId = "5"
		const itemId = toFlowItemId(`${testnetCollection}:${tokenId}`)

		const orderTx = await testnetSdk.order.sell({
			collection: testnetCollection,
			currency: "FLOW",
			itemId: itemId,
			sellItemPrice: "1",
		})

		const order = await awaitOrder(testnetSdk, orderTx.orderId)
		const updateTx = await testnetSdk.order.updateOrder({
			collection: testnetCollection,
			currency: "FLOW",
			order,
			sellItemPrice: toBigNumber("0.001"),
		})
		checkEvent(updateTx, "ListingAvailable", "NFTStorefrontV2")
	}, 1000000)
})
