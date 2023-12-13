import {
	// createEmulatorAccount,
	createFlowEmulator,
	createTestAuth,
	FLOW_TESTNET_ACCOUNT_4,
} from "@rarible/flow-test-common"
import * as fcl from "@onflow/fcl"
import { toBigNumberLike, toFlowAddress, toFlowContractAddress } from "@rarible/types"
// import type { FlowSdk } from "../index"
import {FLOW_TESTNET_ACCOUNT_5} from "@rarible/flow-test-common"
import {FLOW_TESTNET_ACCOUNT_MATRIX} from "@rarible/flow-test-common"
import { checkEvent } from "../test/helpers/check-event"
import { EmulatorCollections, TestnetCollections } from "../config/config"
import { createEvolutionTestEnvironment, getEvolutionIds } from "../test/helpers/emulator/evolution"
import { createTopShotTestEnvironment, getTopShotIds } from "../test/helpers/emulator/top-shot"
import { borrowMotoGpCardId, createMotoGpTestEnvironment } from "../test/helpers/emulator/moto-gp-card"
import { createFusdTestEnvironment } from "../test/helpers/emulator/setup-fusd-env"
import { toFlowItemId } from "../common/item"
import { createMugenArtTestEnvironment, getMugenArtIds } from "../test/helpers/emulator/mugen-art"
import {createTestFlowSdk} from "../common/test"
describe("Mattel storefront sell testing", () => {

	test("Should create HWGaragePack sell order on testnet", async () => {
		const testnetAuth = createTestAuth(fcl, "testnet", FLOW_TESTNET_ACCOUNT_5.address, FLOW_TESTNET_ACCOUNT_5.privKey)
		const testnetSdk = createTestFlowSdk(fcl, "testnet", {}, testnetAuth)
		const testnetCollection = toFlowContractAddress(TestnetCollections.HWGaragePack)
		// const tokenId = "30"

		const orderTx = await testnetSdk.order.sell({
			collection: testnetCollection,
			currency: "FLOW",
			// itemId: toFlowItemId(`${testnetCollection}:${tokenId}`),
			itemId: toFlowItemId("A.d0bcefdf1e67ea85.HWGarageTokenV2:10919"),
			sellItemPrice: "1",
		})

		expect(orderTx.orderId).toBeTruthy()

	}, 1000000)

	test("Should create HWGaragePackV2 sell order on testnet", async () => {
		const testnetAuth = createTestAuth(fcl, "testnet", FLOW_TESTNET_ACCOUNT_5.address, FLOW_TESTNET_ACCOUNT_5.privKey)
		const testnetSdk = createTestFlowSdk(fcl, "testnet", {}, testnetAuth)
		const testnetCollection = toFlowContractAddress(TestnetCollections.HWGaragePackV2)
		const tokenId = "15"

		const orderTx = await testnetSdk.order.sell({
			collection: testnetCollection,
			currency: "FLOW",
			itemId: toFlowItemId(`${testnetCollection}:${tokenId}`),
			sellItemPrice: "1",
		})

		console.log("or", orderTx)
		expect(orderTx.orderId).toBeTruthy()

	}, 1000000)

	test("Should create HWGarageCard sell order on testnet", async () => {
		const testnetAuth = createTestAuth(fcl, "testnet", FLOW_TESTNET_ACCOUNT_5.address, FLOW_TESTNET_ACCOUNT_5.privKey)
		const testnetSdk = createTestFlowSdk(fcl, "testnet", {}, testnetAuth)
		const testnetCollection = toFlowContractAddress(TestnetCollections.HWGarageCard)
		const tokenId = "155"

		const orderTx = await testnetSdk.order.sell({
			collection: testnetCollection,
			currency: "FLOW",
			itemId: toFlowItemId(`${testnetCollection}:${tokenId}`),
			sellItemPrice: "0.0001",
		})

		console.log("orderTx", orderTx)
		expect(orderTx.orderId).toBeTruthy()

	}, 1000000)

	test("Should create HWGarageCardV2 sell order on testnet", async () => {
		const testnetAuth = createTestAuth(fcl, "testnet", FLOW_TESTNET_ACCOUNT_5.address, FLOW_TESTNET_ACCOUNT_5.privKey)
		const testnetSdk = createTestFlowSdk(fcl, "testnet", {}, testnetAuth)
		const testnetCollection = toFlowContractAddress(TestnetCollections.HWGarageCardV2)
		const tokenId = "37"

		const orderTx = await testnetSdk.order.sell({
			collection: testnetCollection,
			currency: "FLOW",
			itemId: toFlowItemId(`${testnetCollection}:${tokenId}`),
			sellItemPrice: "0.0001",
			end: new Date(Date.now() + 1000 * 60 * 60 * 24),
		})

		console.log("orderTx", JSON.stringify(orderTx, null, "	"))
		expect(orderTx.orderId).toBeTruthy()

	}, 1000000)

	test("Should create Gamisodes sell order on testnet", async () => {
		const testnetAuth = createTestAuth(fcl, "testnet", FLOW_TESTNET_ACCOUNT_MATRIX.address, FLOW_TESTNET_ACCOUNT_MATRIX.privKey)
		const testnetSdk = createTestFlowSdk(fcl, "testnet", {}, testnetAuth)
		const testnetCollection = toFlowContractAddress(TestnetCollections.Gamisodes)
		// const tokenId = "64205"
		// const tokenId = "64211"
		const tokenId = "64204"

		const orderTx = await testnetSdk.order.sell({
			collection: testnetCollection,
			currency: "FLOW",
			itemId: toFlowItemId(`${testnetCollection}:${tokenId}`),
			sellItemPrice: "0.0001",
			end: new Date(Date.now() + 1000 * 60 * 60 * 24),
		})

		console.log("orderTx", JSON.stringify(orderTx, null, "	"))
		expect(orderTx.orderId).toBeTruthy()

	}, 1000000)

})


describe("Test sell on emulator", () => {
	// let sdk: FlowSdk
	createFlowEmulator({})
	const collection = toFlowContractAddress(EmulatorCollections.RARIBLE)

	beforeAll(async () => {
		// const { address, pk } = await createEmulatorAccount("accountName")
		// const auth = createTestAuth(fcl, "emulator", address, pk, 0)
		// sdk = createTestFlowSdk(fcl, "emulator", {}, auth)
	})

	test.skip("Should create new sell order on testnet", async () => {
		const testnetAuth = createTestAuth(fcl, "testnet", FLOW_TESTNET_ACCOUNT_4.address, FLOW_TESTNET_ACCOUNT_4.privKey)
		const testnetSdk = createTestFlowSdk(fcl, "testnet", {}, testnetAuth)
		const testnetCollection = toFlowContractAddress(TestnetCollections.RARIBLE)
		const mintTx = await testnetSdk.nft.mint(
			testnetCollection,
			"ipfs://ipfs/QmNe7Hd9xiqm1MXPtQQjVtksvWX6ieq9Wr6kgtqFo9D4CU",
			[{ account: toFlowAddress(FLOW_TESTNET_ACCOUNT_4.address), value: toBigNumberLike("0.1") }],
		)

		const orderTx = await testnetSdk.order.sell({
			collection: testnetCollection,
			currency: "FLOW",
			itemId: mintTx.tokenId,
			sellItemPrice: "1",
			originFees: [{ account: toFlowAddress(FLOW_TESTNET_ACCOUNT_4.address), value: toBigNumberLike("0.2") }],
		})

		expect(orderTx.orderId).toBeTruthy()

	}, 1000000)

	test("Should create RaribleNFT sell order", async () => {
		const testnetAuth = createTestAuth(fcl, "testnet", FLOW_TESTNET_ACCOUNT_4.address, FLOW_TESTNET_ACCOUNT_4.privKey)
		const sdk = createTestFlowSdk(fcl, "testnet", {}, testnetAuth)
		const mintTx = await sdk.nft.mint(
			collection,
			"ipfs://ipfs/QmNe7Hd9xiqm1MXPtQQjVtksvWX6ieq9Wr6kgtqFo9D4CU",
			[],
		)
		const tx = await sdk.order.sell({
			collection,
			currency: "FLOW",
			itemId: mintTx.tokenId,
			sellItemPrice: "1",
			payouts: [],
			originFees: [],
		})
		expect(tx.status).toEqual(4)
	}, 1000000)

	test("Should create RaribleNFT sell order for FUSD", async () => {
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
		expect(tx.status).toEqual(4)
	})

	test("Should create sell order from evolution nft", async () => {
		const { acc1, serviceAcc } = await createEvolutionTestEnvironment(fcl)

		const result = await getEvolutionIds(fcl, serviceAcc.address, acc1.address, acc1.tokenId)
		expect(result.data.itemId).toEqual(1)
		const evolutionCollection = toFlowContractAddress(EmulatorCollections.EVOLUTION)
		const sellTx = await acc1.sdk.order.sell({
			collection: evolutionCollection,
			currency: "FLOW",
			itemId: toFlowItemId(`${evolutionCollection}:1`),
			sellItemPrice: "0.0001",
		})
		checkEvent(sellTx, "ListingAvailable", "NFTStorefront")
	})

	test("Should create sell order from TopShot nft", async () => {
		const topShotColletion = toFlowContractAddress(EmulatorCollections.TOPSHOT)
		const { acc1, serviceAcc } = await createTopShotTestEnvironment(fcl)

		const [result] = await getTopShotIds(fcl, serviceAcc.address, acc1.address)
		expect(result).toEqual(1)

		const sellTx = await acc1.sdk.order.sell({
			collection: topShotColletion,
			currency: "FLOW",
			itemId: toFlowItemId(`${topShotColletion}:${result}`),
			sellItemPrice: "0.0001",
		})
		checkEvent(sellTx, "ListingAvailable", "NFTStorefront")
	})

	test("Should create sell order from MotoCpCard nft", async () => {
		const motoGpColletion = toFlowContractAddress(EmulatorCollections.MOTOGP)
		const { acc1, serviceAcc } = await createMotoGpTestEnvironment(fcl)

		const result = await borrowMotoGpCardId(fcl, serviceAcc.address, acc1.address, 1)
		expect(result.cardID).toEqual(1)

		const sellTx = await acc1.sdk.order.sell({
			collection: motoGpColletion,
			currency: "FLOW",
			itemId: toFlowItemId(`${motoGpColletion}:${result.cardID}`),
			sellItemPrice: "0.0001",
		})
		checkEvent(sellTx, "ListingAvailable", "NFTStorefront")
	})
	test("Should create sell order from MugenArt nft", async () => {
		const mugenArtCollection = toFlowContractAddress(EmulatorCollections.MUGENNFT)
		const { acc1, serviceAcc } = await createMugenArtTestEnvironment(fcl)

		const [id] = await getMugenArtIds(fcl, serviceAcc.address, acc1.address)
		expect(id).toEqual(0)

		const sellTx = await acc1.sdk.order.sell({
			collection: mugenArtCollection,
			currency: "FLOW",
			itemId: toFlowItemId(`${mugenArtCollection}:${id}`),
			sellItemPrice: "0.0001",
		})
		checkEvent(sellTx, "ListingAvailable", "NFTStorefront")
	})
})
