import {
	createTestAuth,
	FLOW_TESTNET_ACCOUNT_2,
	FLOW_TESTNET_ACCOUNT_3,
	FLOW_TESTNET_ACCOUNT_4,
} from "@rarible/flow-test-common"
import * as fcl from "@onflow/fcl"
import { createEmulatorAccount, createFlowEmulator } from "@rarible/flow-test-common/src"
import { toBigNumber, toFlowAddress, toFlowContractAddress } from "@rarible/types"
import { toBn } from "@rarible/utils"
import type { FlowSdk } from "../index"
import { createFlowSdk } from "../index"
import { EmulatorCollections, TestnetCollections } from "../config"
import { createFusdTestEnvironment } from "../test/setup-fusd-env"
import { checkEvent } from "../test/check-event"
import { createEvolutionTestEnvironment, getEvolutionIds } from "../test/evolution"
import { toFlowItemId } from "../common/item"
import { createTopShotTestEnvironment, getTopShotIds } from "../test/top-shot"
import { borrowMotoGpCardId, createMotoGpTestEnvironment } from "../test/moto-gp-card"
import { getOrderDetailsFromBlockchain } from "../test/get-order-details-from-blockchain"

describe("Test buy on emulator", () => {
	let sdk: FlowSdk
	createFlowEmulator({})
	const collection = toFlowContractAddress(EmulatorCollections.RARIBLE)

	test.skip("Should create new sell order on testnet", async () => {
		const testnetAuth = createTestAuth(fcl, "testnet", FLOW_TESTNET_ACCOUNT_3.address, FLOW_TESTNET_ACCOUNT_3.privKey)
		const testnetSdk = createFlowSdk(fcl, "testnet", {}, testnetAuth)
		const testnetAuth2 = createTestAuth(fcl, "testnet", FLOW_TESTNET_ACCOUNT_4.address, FLOW_TESTNET_ACCOUNT_4.privKey)
		const testnetSdk2 = createFlowSdk(fcl, "testnet", {}, testnetAuth2)
		const testnetCollection = toFlowContractAddress(TestnetCollections.RARIBLE)
		const acc1bal = await testnetSdk.wallet.getFungibleBalance(toFlowAddress(FLOW_TESTNET_ACCOUNT_3.address), "FLOW")
		const mintTx = await testnetSdk.nft.mint(
			testnetCollection,
			"ipfs://ipfs/QmNe7Hd9xiqm1MXPtQQjVtksvWX6ieq9Wr6kgtqFo9D4CU",
			[{ account: toFlowAddress(FLOW_TESTNET_ACCOUNT_3.address), value: toBigNumber("0.1") }],
		)
		expect(
			toBn(await testnetSdk.wallet.getFungibleBalance(toFlowAddress(FLOW_TESTNET_ACCOUNT_3.address), "FLOW")).toString(),
		).toEqual(toBn(acc1bal).minus("0.00001000").toString())

		const orderTx = await testnetSdk.order.sell({
			collection: testnetCollection,
			currency: "FLOW",
			itemId: mintTx.tokenId,
			sellItemPrice: "1",
			originFees: [{ account: toFlowAddress(FLOW_TESTNET_ACCOUNT_2.address), value: toBigNumber("0.05") }],
		})
		const buyTx = await testnetSdk2.order.buy(
			testnetCollection,
			"FLOW",
			orderTx.orderId,
			toFlowAddress(FLOW_TESTNET_ACCOUNT_3.address),
			[],
		)

		expect(buyTx.status).toEqual(4)

	}, 1000000)

	test("Should buy RaribleNFT order for FLOW tokens", async () => {
		const { address, pk } = await createEmulatorAccount("accountName")
		const auth = createTestAuth(fcl, "emulator", address, pk, 0)
		sdk = createFlowSdk(fcl, "emulator", {}, auth)
		const mintTx = await sdk.nft.mint(collection, "ipfs://ipfs/QmNe7Hd9xiqm1MXPtQQjVtksvWX6ieq9Wr6kgtqFo9D4CU", [])
		expect(mintTx.status).toEqual(4)
		const tx = await sdk.order.sell({
			collection,
			currency: "FLOW",
			itemId: mintTx.tokenId,
			sellItemPrice: "0.001",
			originFees: [{ account: toFlowAddress(address), value: toBigNumber("0.1") }],
		})
		// const { orderId } = tx.events[2].data
		expect(tx.orderId).toBeGreaterThan(0)

		const currency = await getOrderDetailsFromBlockchain(fcl, "emulator", address, tx.orderId)
		const buyTx = await sdk.order.buy(collection, currency.currency, tx.orderId, address, [])
		expect(buyTx.status).toEqual(4)
	})

	test("Should buy RaribleNFT order for FUSD tokens", async () => {
		const { acc1, acc2 } = await createFusdTestEnvironment(fcl, "emulator")

		const mintTx = await acc1.sdk.nft.mint(collection, "ipfs://ipfs/QmNe7Hd9xiqm1MXPtQQjVtksvWX6ieq9Wr6kgtqFo9D4CU", [])
		expect(mintTx.status).toEqual(4)
		const tx = await acc1.sdk.order.sell({
			collection,
			currency: "FUSD",
			itemId: mintTx.tokenId,
			sellItemPrice: "0.001",
			originFees: [],
		})

		const buyTx = await acc2.sdk.order.buy(collection, "FUSD", tx.orderId, acc1.address, [])
		checkEvent(buyTx, "ListingCompleted", "NFTStorefront")
	})

	test("Should buy an evolution nft", async () => {
		const evolutionCollection = toFlowContractAddress(EmulatorCollections.EVOLUTION)
		const { acc1, acc2, serviceAcc } = await createEvolutionTestEnvironment(fcl)

		const result = await getEvolutionIds(fcl, serviceAcc.address, acc1.address, acc1.tokenId)
		expect(result.data.itemId).toEqual(1)

		const sellTx = await acc1.sdk.order.sell(
			{
				collection: evolutionCollection,
				currency: "FLOW",
				itemId: toFlowItemId(`${evolutionCollection}:1`),
				sellItemPrice: "0.0001",
			},
		)
		checkEvent(sellTx, "ListingAvailable", "NFTStorefront")

		const buyTx = await acc2.sdk.order.buy(evolutionCollection, "FLOW", sellTx.orderId, acc1.address, [])
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
			{
				collection: topShotColletion,
				currency: "FLOW",
				itemId: toFlowItemId(`${topShotColletion}:${result}`),
				sellItemPrice: "0.0001",
			},
		)
		checkEvent(sellTx, "ListingAvailable", "NFTStorefront")


		const buyTx = await acc2.sdk.order.buy(topShotColletion, "FLOW", sellTx.orderId, acc1.address, [])
		checkEvent(buyTx, "ListingCompleted", "NFTStorefront")
		const [checkNft] = await getTopShotIds(fcl, serviceAcc.address, acc2.address)
		expect(checkNft).toEqual(1)
	})

	test("Should buy MotoCpCard nft", async () => {
		const motoGpColletion = toFlowContractAddress(EmulatorCollections.MOTOGP)
		const { acc1, acc2, serviceAcc } = await createMotoGpTestEnvironment(fcl)

		const result = await borrowMotoGpCardId(fcl, serviceAcc.address, acc1.address, 1)
		expect(result.cardID).toEqual(1)

		const sellTx = await acc1.sdk.order.sell({
			collection: motoGpColletion,
			currency: "FLOW",
			itemId: toFlowItemId(`${motoGpColletion}:${result.cardID}`),
			sellItemPrice: "0.0001",
		})
		checkEvent(sellTx, "ListingAvailable", "NFTStorefront")

		const buyTx = await acc2.sdk.order.buy(motoGpColletion, "FLOW", sellTx.orderId, acc1.address, [])
		checkEvent(buyTx, "ListingCompleted", "NFTStorefront")
		const buyResult = await borrowMotoGpCardId(fcl, serviceAcc.address, acc2.address, 1)
		expect(buyResult.cardID).toEqual(1)
	})
})
