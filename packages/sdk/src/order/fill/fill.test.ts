import {
	createEmulatorAccount,
	createFlowEmulator,
	createTestAuth,
	FLOW_TESTNET_ACCOUNT_4,
} from "@rarible/flow-test-common"
import * as fcl from "@onflow/fcl"
import { toBigNumber, toFlowAddress } from "@rarible/types"
import { toBn } from "@rarible/utils"
import {
	FLOW_TESTNET_ACCOUNT_BEAR,
	FLOW_TESTNET_ACCOUNT_PANDA,
} from "@rarible/flow-test-common/build/config"
import type {FlowCurrency, FlowSdk} from "../../index"
import { toFlowContractAddress } from "../../index"
import { EmulatorCollections, TestnetCollections } from "../../config/config"
import { createFusdTestEnvironment } from "../../test/helpers/emulator/setup-fusd-env"
import { checkEvent } from "../../test/helpers/check-event"
import { createEvolutionTestEnvironment, getEvolutionIds } from "../../test/helpers/emulator/evolution"
import { toFlowItemId } from "../../common/item"
import { createTopShotTestEnvironment, getTopShotIds } from "../../test/helpers/emulator/top-shot"
import { borrowMotoGpCardId, createMotoGpTestEnvironment } from "../../test/helpers/emulator/moto-gp-card"
import { getOrderDetailsFromBlockchain } from "../common/get-order-details-from-blockchain"
import { getTestOrderTmplate } from "../../test/helpers/order-template"
import { createMugenArtTestEnvironment, getMugenArtIds } from "../../test/helpers/emulator/mugen-art"
import { delay, retry } from "../../common/retry"
import { awaitOrder } from "../common/await-order"
import {createTestFlowSdk} from "../../common/test"

describe("Mattel storefront fill testing", () => {
	const [buyerAddr, buyerPrivKey] = [FLOW_TESTNET_ACCOUNT_BEAR.address, FLOW_TESTNET_ACCOUNT_BEAR.privKey]
	const [sellerAddr, sellerPrivKey] = [FLOW_TESTNET_ACCOUNT_PANDA.address, FLOW_TESTNET_ACCOUNT_PANDA.privKey]
	const feeAddr = FLOW_TESTNET_ACCOUNT_4.address

	//todo garage pack doesn't exist on buyer FLOW_TESTNET_ACCOUNT_8 account
	describe.skip.each([
		"FLOW",
		"FUSD",
		"USDC",
	] as FlowCurrency[])
	("Should fill Mattel StorefrontV2 sell order with HWGaragePack item", (currency) => {
		const testnetBuyerAuth = createTestAuth(fcl, "testnet", buyerAddr, buyerPrivKey)
		const testnetBuyerSdk = createTestFlowSdk(fcl, "testnet", {}, testnetBuyerAuth)
		const testnetCollection = toFlowContractAddress(TestnetCollections.HWGaragePack)
		const tokenId = 30

		test("GaragePack item", async () => {
			const testnetAuth = createTestAuth(fcl, "testnet", sellerAddr, sellerPrivKey)
			const testnetSdk = createTestFlowSdk(fcl, "testnet", {}, testnetAuth)

			const itemId = toFlowItemId(`${testnetCollection}:${tokenId}`)

			const sellTx = await testnetSdk.order.sell({
				collection: testnetCollection,
				currency,
				itemId,
				sellItemPrice: "0.001",
				originFees: [{
					account: toFlowAddress(feeAddr),
					value: toBigNumber("1000"),
				}],
			})

			console.log("sexlltx", sellTx)
			checkEvent(sellTx, "ListingAvailable", "NFTStorefrontV2")
			await awaitOrder(testnetSdk, sellTx.orderId)
			const updateTx = await testnetSdk.order.updateOrder({
				collection: testnetCollection,
				currency,
				order: sellTx.orderId,
				sellItemPrice: toBigNumber("0.002"),
			})
			checkEvent(updateTx, "ListingAvailable", "NFTStorefrontV2")

			const startFeeBalance = await testnetSdk.wallet.getFungibleBalance(toFlowAddress(feeAddr), currency)

			const order = await awaitOrder(testnetSdk, updateTx.orderId)
			const buyTx = await testnetBuyerSdk.order.fill(testnetCollection, currency, order, sellerAddr, [])

			checkEvent(buyTx, "ListingCompleted", "NFTStorefrontV2")
			await retry(10, 2000, async () => {
				const finishFeeBalance = await testnetSdk.wallet.getFungibleBalance(toFlowAddress(feeAddr), currency)
				const diffFeeWalletBalance = toBn(finishFeeBalance).minus(startFeeBalance).toString()
				expect(diffFeeWalletBalance.toString()).toBe("0.0002")
			})
		}, 1000000)

		afterAll(async () => {
			await testnetBuyerSdk.nft.transfer(
				testnetCollection,
				tokenId,
				toFlowAddress(sellerAddr)
			)
		})
	})

	//ok
	describe.each([
		"FLOW",
		// "FUSD",
		// "USDC",
	] as FlowCurrency[])
	("Should fill Mattel StorefrontV2 sell order with HWGaragePackV2 item", (currency) => {
		const testnetBuyerAuth = createTestAuth(fcl, "testnet", buyerAddr, buyerPrivKey)
		const testnetBuyerSdk = createTestFlowSdk(fcl, "testnet", {}, testnetBuyerAuth)
		const testnetCollection = toFlowContractAddress(TestnetCollections.HWGaragePackV2)
		const tokenId = 330

		test(`GaragePackV2 <-> ${currency}`, async () => {
			const testnetAuth = createTestAuth(fcl, "testnet", sellerAddr, sellerPrivKey)
			const testnetSdk = createTestFlowSdk(fcl, "testnet", {}, testnetAuth)

			const itemId = toFlowItemId(`${testnetCollection}:${tokenId}`)

			const sellTx = await testnetSdk.order.sell({
				collection: testnetCollection,
				currency: currency,
				itemId,
				sellItemPrice: "0.001",
				originFees: [{
					account: toFlowAddress(feeAddr),
					value: toBigNumber("1000"),
				}],
			})

			console.log("selltx", JSON.stringify(sellTx, null, "  "))
			checkEvent(sellTx, "ListingAvailable", "NFTStorefrontV2")
			await delay(5000)
			const updateTx = await testnetSdk.order.updateOrder({
				collection: testnetCollection,
				currency,
				order: parseInt(sellTx.orderId),
				sellItemPrice: toBigNumber("0.002"),
			})
			checkEvent(updateTx, "ListingAvailable", "NFTStorefrontV2")

			console.log("updateTx", updateTx)
			const startFeeBalance = await testnetSdk.wallet.getFungibleBalance(toFlowAddress(feeAddr), currency)

			const order = await awaitOrder(testnetSdk, updateTx.orderId)
			const buyTx = await testnetBuyerSdk.order.fill(testnetCollection, currency, parseInt(order.id), sellerAddr, [])

			checkEvent(buyTx, "ListingCompleted", "NFTStorefrontV2")
			await retry(10, 2000, async () => {
				const finishFeeBalance = await testnetSdk.wallet.getFungibleBalance(toFlowAddress(feeAddr), currency)
				const diffFeeWalletBalance = toBn(finishFeeBalance).minus(startFeeBalance).toString()
				expect(diffFeeWalletBalance.toString()).toBe("0.0002")
			})
		}, 1000000)

		afterAll(async () => {
			await testnetBuyerSdk.nft.transfer(
				testnetCollection,
				tokenId,
				toFlowAddress(sellerAddr)
			)
		})
	})

	//ok
	describe.each([
		"FLOW",
		"FUSD",
		"USDC",
	] as FlowCurrency[])
	("sell order with HWGarageCard item", (currency) => {
		const testnetBuyerAuth = createTestAuth(fcl, "testnet", buyerAddr, buyerPrivKey)
		const testnetBuyerSdk = createTestFlowSdk(fcl, "testnet", {}, testnetBuyerAuth)
		const testnetCollection = toFlowContractAddress(TestnetCollections.HWGarageCard)
		const tokenId = 160

		test(`HWGarageCard <-> ${currency}`, async () => {
			const testnetAuth = createTestAuth(fcl, "testnet", sellerAddr, sellerPrivKey)
			const testnetSdk = createTestFlowSdk(fcl, "testnet", {}, testnetAuth)

			const itemId = toFlowItemId(`${testnetCollection}:${tokenId}`)

			console.log("item", itemId)
			const sellTx = await testnetSdk.order.sell({
				collection: testnetCollection,
				currency: currency,
				itemId,
				sellItemPrice: "0.001",
				originFees: [{
					account: toFlowAddress(feeAddr),
					value: toBigNumber("1000"),
				}],
			})
			console.log(sellTx)
			checkEvent(sellTx, "ListingAvailable", "NFTStorefrontV2")

			await delay(5000)
			const updateTx = await testnetSdk.order.updateOrder({
				collection: testnetCollection,
				currency,
				order: sellTx.orderId,
				sellItemPrice: toBigNumber("0.002"),
			})
			checkEvent(updateTx, "ListingAvailable", "NFTStorefrontV2")

			const startFeeBalance = await testnetSdk.wallet.getFungibleBalance(toFlowAddress(feeAddr), currency)

			const order = await awaitOrder(testnetSdk, updateTx.orderId)
			const buyTx = await testnetBuyerSdk.order.fill(testnetCollection, currency, order, sellerAddr, [])
			checkEvent(buyTx, "ListingCompleted", "NFTStorefrontV2")

			await retry(10, 2000, async () => {
				const finishFeeBalance = await testnetSdk.wallet.getFungibleBalance(toFlowAddress(feeAddr), currency)
				const diffFeeWalletBalance = toBn(finishFeeBalance).minus(startFeeBalance).toString()
				expect(diffFeeWalletBalance.toString()).toBe("0.0002")
			})
		}, 1000000)

		afterAll(async () => {
			await testnetBuyerSdk.nft.transfer(
				testnetCollection,
				tokenId,
				toFlowAddress(sellerAddr)
			)
		})
	})


	//ok
	describe.each([
		"FLOW",
		"FUSD",
		"USDC",
	] as FlowCurrency[])
	("sell order with HWGarageCardV2 item", (currency) => {
		const testnetBuyerAuth = createTestAuth(fcl, "testnet", buyerAddr, buyerPrivKey)
		const testnetBuyerSdk = createTestFlowSdk(fcl, "testnet", {}, testnetBuyerAuth)
		const testnetCollection = toFlowContractAddress(TestnetCollections.HWGarageCardV2)
		const tokenId = 302

		test("HWGarageCardV2 item", async () => {
			const testnetAuth = createTestAuth(fcl, "testnet", sellerAddr, sellerPrivKey)
			const testnetSdk = createTestFlowSdk(fcl, "testnet", {}, testnetAuth)

			const itemId = toFlowItemId(`${testnetCollection}:${tokenId}`)

			const sellTx = await testnetSdk.order.sell({
				collection: testnetCollection,
				currency: currency,
				itemId,
				sellItemPrice: "0.001",
				originFees: [{
					account: toFlowAddress(feeAddr),
					value: toBigNumber("1000"),
				}],
			})
			console.log("sell", sellTx)
			checkEvent(sellTx, "ListingAvailable", "NFTStorefrontV2")

			await delay(5000)
			const updateTx = await testnetSdk.order.updateOrder({
				collection: testnetCollection,
				currency,
				order: sellTx.orderId,
				sellItemPrice: toBigNumber("0.002"),
			})
			checkEvent(updateTx, "ListingAvailable", "NFTStorefrontV2")


			const startFeeBalance = await testnetSdk.wallet.getFungibleBalance(toFlowAddress(feeAddr), currency)

			const order = await awaitOrder(testnetSdk, updateTx.orderId)
			const buyTx = await testnetBuyerSdk.order.fill(testnetCollection, currency, order, sellerAddr, [])
			checkEvent(buyTx, "ListingCompleted", "NFTStorefrontV2")
			await retry(10, 2000, async () => {
				const finishFeeBalance = await testnetSdk.wallet.getFungibleBalance(toFlowAddress(feeAddr), currency)
				const diffFeeWalletBalance = toBn(finishFeeBalance).minus(startFeeBalance).toString()
				expect(diffFeeWalletBalance.toString()).toBe("0.0002")
			})
		}, 1000000)

		afterAll(async () => {
			await testnetBuyerSdk.nft.transfer(
				testnetCollection,
				tokenId,
				toFlowAddress(sellerAddr)
			)
		})
	})

	//ok
	describe.each([
		"FLOW",
		"FUSD",
		"USDC",
	] as FlowCurrency[])
	("order with BBxBarbiePack item", (currency) => {
		const testnetBuyerAuth = createTestAuth(fcl, "testnet", buyerAddr, buyerPrivKey)
		const testnetBuyerSdk = createTestFlowSdk(fcl, "testnet", {}, testnetBuyerAuth)
		const testnetCollection = toFlowContractAddress(TestnetCollections.BBxBarbiePack)
		const tokenId = 2

		test(`BBxBarbiePack <-> ${currency}`, async () => {
			const testnetAuth = createTestAuth(fcl, "testnet", sellerAddr, sellerPrivKey)
			const testnetSdk = createTestFlowSdk(fcl, "testnet", {}, testnetAuth)

			const itemId = toFlowItemId(`${testnetCollection}:${tokenId}`)

			const sellTx = await testnetSdk.order.sell({
				collection: testnetCollection,
				currency: currency,
				itemId,
				sellItemPrice: "0.0001",
				originFees: [{
					account: toFlowAddress(feeAddr),
					value: toBigNumber("1000"),
				}],
			})
			console.log("sell", sellTx)
			checkEvent(sellTx, "ListingAvailable", "NFTStorefrontV2")

			await delay(5000)
			const updateTx = await testnetSdk.order.updateOrder({
				collection: testnetCollection,
				currency,
				order: sellTx.orderId,
				sellItemPrice: toBigNumber("0.0002"),
			})
			checkEvent(updateTx, "ListingAvailable", "NFTStorefrontV2")
			const startFeeBalance = await testnetSdk.wallet.getFungibleBalance(toFlowAddress(feeAddr), currency)

			const order = await awaitOrder(testnetSdk, updateTx.orderId)
			const buyTx = await testnetBuyerSdk.order.fill(testnetCollection, currency, order, sellerAddr, [])
			checkEvent(buyTx, "ListingCompleted", "NFTStorefrontV2")
			await retry(10, 2000, async () => {
				const finishFeeBalance = await testnetSdk.wallet.getFungibleBalance(toFlowAddress(feeAddr), currency)
				const diffFeeWalletBalance = toBn(finishFeeBalance).minus(startFeeBalance).toString()
				expect(diffFeeWalletBalance.toString()).toBe("0.00002")
			})
		}, 1000000)

		afterAll(async () => {
			await testnetBuyerSdk.nft.transfer(
				testnetCollection,
				tokenId,
				toFlowAddress(sellerAddr)
			)
		})
	})

	//ok
	describe.each([
		"FLOW",
		"FUSD",
		"USDC",
	] as FlowCurrency[])
	("Should fail buy Mattel StorefrontV2 order with BBxBarbieCard item", (currency) => {
		const testnetBuyerAuth = createTestAuth(fcl, "testnet", buyerAddr, buyerPrivKey)
		const testnetBuyerSdk = createTestFlowSdk(fcl, "testnet", {}, testnetBuyerAuth)
		const testnetCollection = toFlowContractAddress(TestnetCollections.BBxBarbieCard)
		const tokenId = 16

		test(`BBxBarbieCard <-> ${currency}`, async () => {
			const testnetAuth = createTestAuth(fcl, "testnet", sellerAddr, sellerPrivKey)
			const testnetSdk = createTestFlowSdk(fcl, "testnet", {}, testnetAuth)

			const itemId = toFlowItemId(`${testnetCollection}:${tokenId}`)

			const sellTx = await testnetSdk.order.sell({
				collection: testnetCollection,
				currency: currency,
				itemId,
				sellItemPrice: "0.0001",
				originFees: [{
					account: toFlowAddress(feeAddr),
					value: toBigNumber("1000"),
				}],
			})
			console.log("sell", sellTx)
			checkEvent(sellTx, "ListingAvailable", "NFTStorefrontV2")
			await delay(5000)
			const updateTx = await testnetSdk.order.updateOrder({
				collection: testnetCollection,
				currency,
				order: sellTx.orderId,
				sellItemPrice: toBigNumber("0.0002"),
			})
			checkEvent(updateTx, "ListingAvailable", "NFTStorefrontV2")

			const startFeeBalance = await testnetSdk.wallet.getFungibleBalance(toFlowAddress(feeAddr), currency)

			const order = await awaitOrder(testnetSdk, updateTx.orderId)
			const buyTx = await testnetBuyerSdk.order.fill(testnetCollection, currency, order, sellerAddr, [])
			checkEvent(buyTx, "ListingCompleted", "NFTStorefrontV2")
			await retry(10, 2000, async () => {
				const finishFeeBalance = await testnetSdk.wallet.getFungibleBalance(toFlowAddress(feeAddr), currency)
				const diffFeeWalletBalance = toBn(finishFeeBalance).minus(startFeeBalance).toString()
				expect(diffFeeWalletBalance.toString()).toBe("0.00002")
			})
		}, 1000000)

		afterAll(async () => {
			await testnetBuyerSdk.nft.transfer(
				testnetCollection,
				tokenId,
				toFlowAddress(sellerAddr)
			)
		})
	})

	//ok
	describe.each([
		"FLOW",
		"USDC",
	] as FlowCurrency[])
	("Should fail buy Mattel StorefrontV2 order with Gamisodes item", (currency) => {
		const testnetBuyerAuth = createTestAuth(fcl, "testnet", buyerAddr, buyerPrivKey)
		const testnetBuyerSdk = createTestFlowSdk(fcl, "testnet", {}, testnetBuyerAuth)
		const testnetCollection = toFlowContractAddress(TestnetCollections.Gamisodes)
		const tokenId = 64205

		test(`Gamisodes <-> ${currency}`, async () => {
			const testnetAuth = createTestAuth(fcl, "testnet", sellerAddr, sellerPrivKey)
			const testnetSdk = createTestFlowSdk(fcl, "testnet", {}, testnetAuth)

			const itemId = toFlowItemId(`${testnetCollection}:${tokenId}`)

			const sellTx = await testnetSdk.order.sell({
				collection: testnetCollection,
				currency: currency,
				itemId,
				sellItemPrice: "0.0001",
				originFees: [{
					account: toFlowAddress(feeAddr),
					value: toBigNumber("1000"),
				}],
			})
			console.log("sell", sellTx)
			checkEvent(sellTx, "ListingAvailable", "NFTStorefrontV2")
			await delay(5000)
			const updateTx = await testnetSdk.order.updateOrder({
				collection: testnetCollection,
				currency,
				order: sellTx.orderId,
				sellItemPrice: toBigNumber("0.0002"),
			})
			checkEvent(updateTx, "ListingAvailable", "NFTStorefrontV2")

			const startFeeBalance = await testnetSdk.wallet.getFungibleBalance(toFlowAddress(feeAddr), currency)

			const order = await awaitOrder(testnetSdk, updateTx.orderId)
			const buyTx = await testnetBuyerSdk.order.fill(testnetCollection, currency, order, sellerAddr, [])
			checkEvent(buyTx, "ListingCompleted", "NFTStorefrontV2")
			await retry(10, 2000, async () => {
				const finishFeeBalance = await testnetSdk.wallet.getFungibleBalance(toFlowAddress(feeAddr), currency)
				const diffFeeWalletBalance = toBn(finishFeeBalance).minus(startFeeBalance).toString()
				expect(diffFeeWalletBalance.toString()).toBe("0.00002")
			})
		}, 1000000)

		afterAll(async () => {
			await testnetBuyerSdk.nft.transfer(
				testnetCollection,
				tokenId,
				toFlowAddress(sellerAddr)
			)
		})
	})

})

describe("Test fill on emulator", () => {
	let sdk: FlowSdk
	createFlowEmulator({})
	const collection = toFlowContractAddress(EmulatorCollections.RARIBLE)

	test("Should fill RaribleNFT order for FLOW tokens", async () => {
		const { address, pk } = await createEmulatorAccount("accountName")
		const { address: address2 } = await createEmulatorAccount("accountName2")
		const auth = createTestAuth(fcl, "emulator", address, pk, 0)
		sdk = createTestFlowSdk(fcl, "emulator", {}, auth)
		const mintTx = await sdk.nft.mint(collection, "ipfs://ipfs/QmNe7Hd9xiqm1MXPtQQjVtksvWX6ieq9Wr6kgtqFo9D4CU", [])
		expect(mintTx.status).toEqual(4)
		const tx = await sdk.order.sell({
			collection,
			currency: "FLOW",
			itemId: mintTx.tokenId,
			sellItemPrice: "0.001",
			originFees: [{ account: toFlowAddress(address2), value: toBigNumber("0.1") }],
		})
		// const { orderId } = tx.events[2].data
		expect(tx.orderId).toBeGreaterThan(0)
		const order = getTestOrderTmplate("sell", tx.orderId, mintTx.tokenId, toBigNumber("0.001"))
		const blockchainBidDetails = await getOrderDetailsFromBlockchain(fcl, "emulator", "sell", address, parseInt(tx.orderId))

		const buyTx = await sdk.order.fill(collection, blockchainBidDetails.currency, order, address, [])
		expect(buyTx.status).toEqual(4)
	})

	test("Should fill RaribleNFT bid order for FLOW tokens", async () => {
		const { address: address0 } = await createEmulatorAccount("accountName1")
		const { address, pk } = await createEmulatorAccount("accountName")
		const auth = createTestAuth(fcl, "emulator", address, pk, 0)
		sdk = createTestFlowSdk(fcl, "emulator", {}, auth)
		const mintTx = await sdk.nft.mint(
			collection,
			"ipfs://ipfs/QmNe7Hd9xiqm1MXPtQQjVtksvWX6ieq9Wr6kgtqFo9D4CU",
			[{ account: toFlowAddress(address0), value: toBigNumber("0.2") }],
		)
		expect(mintTx.status).toEqual(4)
		const tx = await sdk.order.bid(
			collection,
			"FLOW",
			mintTx.tokenId,
			toBigNumber("0.0001"),
			[{ account: toFlowAddress(address0), value: toBigNumber("0.1") }],
		)
		const order = getTestOrderTmplate("bid", tx.orderId, mintTx.tokenId, toBigNumber("0.0001"))
		const blockchainBidDetails = await getOrderDetailsFromBlockchain(fcl, "emulator", "bid", address, parseInt(tx.orderId))
		const buyTx = await sdk.order.fill(collection, blockchainBidDetails.currency, order, address, [{
			account: toFlowAddress(address0),
			value: toBigNumber("0.2"),
		}])
		expect(buyTx.status).toEqual(4)
	})

	test("Should fill RaribleNFT order for FUSD tokens", async () => {
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

		const order = getTestOrderTmplate("sell", tx.orderId, mintTx.tokenId, toBigNumber("0.0001"))
		const buyTx = await acc2.sdk.order.fill(collection, "FUSD", order, acc1.address, [])
		checkEvent(buyTx, "ListingCompleted", "NFTStorefront")
	})

	test("Should fill an evolution nft", async () => {
		const evolutionCollection = toFlowContractAddress(EmulatorCollections.EVOLUTION)
		const { acc1, acc2, serviceAcc } = await createEvolutionTestEnvironment(fcl)

		const result = await getEvolutionIds(fcl, serviceAcc.address, acc1.address, acc1.tokenId)
		expect(result.data.itemId).toEqual(1)

		const itemId = toFlowItemId(`${evolutionCollection}:1`)

		const sellTx = await acc1.sdk.order.sell(
			{
				collection: evolutionCollection,
				currency: "FLOW",
				itemId,
				sellItemPrice: "0.0001",
			},
		)
		checkEvent(sellTx, "ListingAvailable", "NFTStorefront")
		const order = getTestOrderTmplate("sell", sellTx.orderId, itemId, toBigNumber("0.0001"))
		const buyTx = await acc2.sdk.order.fill(evolutionCollection, "FLOW", order, acc1.address, [])
		checkEvent(buyTx, "ListingCompleted", "NFTStorefront")
		const checkNft = await getEvolutionIds(fcl, serviceAcc.address, acc2.address, acc1.tokenId)
		expect(checkNft.data.itemId).toEqual(1)
	})

	test("Should fill TopShot nft", async () => {
		const topShotColletion = toFlowContractAddress(EmulatorCollections.TOPSHOT)
		const { acc1, acc2, serviceAcc } = await createTopShotTestEnvironment(fcl)

		const [result] = await getTopShotIds(fcl, serviceAcc.address, acc1.address)
		expect(result).toEqual(1)

		const itemId = toFlowItemId(`${topShotColletion}:${result}`)

		const sellTx = await acc1.sdk.order.sell(
			{
				collection: topShotColletion,
				currency: "FLOW",
				itemId,
				sellItemPrice: "0.0001",
			},
		)
		checkEvent(sellTx, "ListingAvailable", "NFTStorefront")

		const order = getTestOrderTmplate("sell", sellTx.orderId, itemId, toBigNumber("0.0001"))
		const buyTx = await acc2.sdk.order.fill(topShotColletion, "FLOW", order, acc1.address, [])
		checkEvent(buyTx, "ListingCompleted", "NFTStorefront")
		const [checkNft] = await getTopShotIds(fcl, serviceAcc.address, acc2.address)
		expect(checkNft).toEqual(1)
	})

	test("Should fill MotoCpCard nft", async () => {
		const motoGpColletion = toFlowContractAddress(EmulatorCollections.MOTOGP)
		const { acc1, acc2, serviceAcc } = await createMotoGpTestEnvironment(fcl)

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
		const buyTx = await acc2.sdk.order.fill(motoGpColletion, "FLOW", order, acc1.address, [])
		checkEvent(buyTx, "ListingCompleted", "NFTStorefront")
		const buyResult = await borrowMotoGpCardId(fcl, serviceAcc.address, acc2.address, 1)
		expect(buyResult.cardID).toEqual(1)
	})

	test("Should fill sell order, MugenArt nft", async () => {
		const mugenArtCollection = toFlowContractAddress(EmulatorCollections.MUGENNFT)
		const { acc1, acc2, serviceAcc } = await createMugenArtTestEnvironment(fcl)

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
		const buyTx = await acc2.sdk.order.fill(mugenArtCollection, "FLOW", order, acc1.address, [])
		checkEvent(buyTx, "ListingCompleted", "NFTStorefront")
		const [buyItemId] = await getMugenArtIds(fcl, serviceAcc.address, acc2.address)
		expect(buyItemId).toEqual(0)
	})
})
