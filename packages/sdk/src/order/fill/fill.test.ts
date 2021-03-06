import { createEmulatorAccount, createFlowEmulator, createTestAuth } from "@rarible/flow-test-common"
import * as fcl from "@onflow/fcl"
import { toBigNumber, toFlowAddress } from "@rarible/types"
import type { FlowSdk } from "../../index"
import { createFlowSdk, toFlowContractAddress } from "../../index"
import { EmulatorCollections } from "../../config/config"
import { createFusdTestEnvironment } from "../../test/helpers/emulator/setup-fusd-env"
import { checkEvent } from "../../test/helpers/check-event"
import { createEvolutionTestEnvironment, getEvolutionIds } from "../../test/helpers/emulator/evolution"
import { toFlowItemId } from "../../common/item"
import { createTopShotTestEnvironment, getTopShotIds } from "../../test/helpers/emulator/top-shot"
import { borrowMotoGpCardId, createMotoGpTestEnvironment } from "../../test/helpers/emulator/moto-gp-card"
import { getOrderDetailsFromBlockchain } from "../common/get-order-details-from-blockchain"
import { getTestOrderTmplate } from "../../test/helpers/order-template"
import { createMugenArtTestEnvironment, getMugenArtIds } from "../../test/helpers/emulator/mugen-art"

describe("Test fill on emulator", () => {
	let sdk: FlowSdk
	createFlowEmulator({})
	const collection = toFlowContractAddress(EmulatorCollections.RARIBLE)

	test("Should fill RaribleNFT order for FLOW tokens", async () => {
		const { address, pk } = await createEmulatorAccount("accountName")
		const { address: address2 } = await createEmulatorAccount("accountName2")
		const auth = createTestAuth(fcl, "emulator", address, pk, 0)
		sdk = createFlowSdk(fcl, "emulator", {}, auth)
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
		const blockchainBidDetails = await getOrderDetailsFromBlockchain(fcl, "emulator", "sell", address, tx.orderId)

		const buyTx = await sdk.order.fill(collection, blockchainBidDetails.currency, order, address, [])
		expect(buyTx.status).toEqual(4)
	})

	test("Should fill RaribleNFT bid order for FLOW tokens", async () => {
		const { address: address0 } = await createEmulatorAccount("accountName1")
		const { address, pk } = await createEmulatorAccount("accountName")
		const auth = createTestAuth(fcl, "emulator", address, pk, 0)
		sdk = createFlowSdk(fcl, "emulator", {}, auth)
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
		const blockchainBidDetails = await getOrderDetailsFromBlockchain(fcl, "emulator", "bid", address, tx.orderId)
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
