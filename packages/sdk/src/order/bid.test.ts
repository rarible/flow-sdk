import { createFlowEmulator } from "@rarible/flow-test-common"
import { toBigNumber, toFlowAddress } from "@rarible/types"
import * as fcl from "@onflow/fcl"
import { toFlowContractAddress, toFlowItemId } from "../index"
import { EmulatorCollections } from "../config/config"
import { createFlowTestEmulatorSdk } from "../test/create-flow-test-sdk"
import { createEvolutionTestEnvironment, getEvolutionIds } from "../test/evolution"
import { checkEvent } from "../test/check-event"
import { createTopShotTestEnvironment, getTopShotIds } from "../test/top-shot"
import { borrowMotoGpCardId, createMotoGpTestEnvironment } from "../test/moto-gp-card"
import { createMugenArtTestEnvironment, getMugenArtIds } from "../test/mugen-art"
import { mintRaribleNftTest } from "../test/transactions/mint-test"
import { getTestOrderTmplate } from "../test/order-template"

describe("Test bid on emulator", () => {
	createFlowEmulator({})
	const collection = toFlowContractAddress(EmulatorCollections.RARIBLE)

	test("Should create/update/cancel RaribleNFT bid order", async () => {
		const { sdk: sdk1 } = await createFlowTestEmulatorSdk("accountName1")
		const { sdk: sdk2, address: address2 } = await createFlowTestEmulatorSdk("accountName2")

		const mintTx = await mintRaribleNftTest(sdk1, collection)

		const tx = await sdk2.order.bid(
			collection,
			"FLOW",
			mintTx.tokenId,
			toBigNumber("1"),
			[{ account: toFlowAddress(address2), value: toBigNumber("0.03") }],
		)
		expect(tx.status).toEqual(4)

		const order = getTestOrderTmplate("bid", tx.orderId, mintTx.tokenId, toBigNumber("1"))
		const updateTx = await sdk2.order.bidUpdate(
			collection, "FLOW", order, toBigNumber("2"),
		)
		checkEvent(updateTx, "BidAvailable", "RaribleOpenBid")

		const cancelBidTx = await sdk2.order.cancelBid(collection, updateTx.orderId)
		checkEvent(cancelBidTx, "BidCompleted", "RaribleOpenBid")
	})

	test("Should create bid order from evolution nft", async () => {
		const { acc1, acc2, serviceAcc } = await createEvolutionTestEnvironment(fcl)

		const result = await getEvolutionIds(fcl, serviceAcc.address, acc1.address, acc1.tokenId)
		expect(result.data.itemId).toEqual(1)
		const evolutionCollection = toFlowContractAddress(EmulatorCollections.EVOLUTION)
		const bidTx = await acc2.sdk.order.bid(
			evolutionCollection,
			"FLOW",
			toFlowItemId(`${evolutionCollection}:1`),
			toBigNumber("0.0001"),
		)
		checkEvent(bidTx, "BidAvailable", "RaribleOpenBid")
	})

	test("Should create sell order from TopShot nft", async () => {
		const topShotColletion = toFlowContractAddress(EmulatorCollections.TOPSHOT)
		const { acc1, serviceAcc } = await createTopShotTestEnvironment(fcl)

		const [result] = await getTopShotIds(fcl, serviceAcc.address, acc1.address)
		expect(result).toEqual(1)

		const bidTx = await acc1.sdk.order.bid(
			topShotColletion,
			"FLOW",
			toFlowItemId(`${topShotColletion}:${result}`),
			toBigNumber("0.0001"),
		)
		checkEvent(bidTx, "BidAvailable", "RaribleOpenBid")
	})

	test("Should create sell order from MotoCpCard nft", async () => {
		const motoGpColletion = toFlowContractAddress(EmulatorCollections.MOTOGP)
		const { acc1, serviceAcc } = await createMotoGpTestEnvironment(fcl)

		const result = await borrowMotoGpCardId(fcl, serviceAcc.address, acc1.address, 1)
		expect(result.cardID).toEqual(1)

		const bidTx = await acc1.sdk.order.bid(
			motoGpColletion,
			"FLOW",
			toFlowItemId(`${motoGpColletion}:${result.cardID}`),
			toBigNumber("0.0001"),
		)
		checkEvent(bidTx, "BidAvailable", "RaribleOpenBid")
	})
	test("Should create sell order from MugenArt nft", async () => {
		const mugenArtCollection = toFlowContractAddress(EmulatorCollections.MUGENNFT)
		const { acc1, serviceAcc } = await createMugenArtTestEnvironment(fcl)

		const [id] = await getMugenArtIds(fcl, serviceAcc.address, acc1.address)
		expect(id).toEqual(0)

		const bidTx = await acc1.sdk.order.bid(
			mugenArtCollection,
			"FLOW",
			toFlowItemId(`${mugenArtCollection}:${id}`),
			toBigNumber("0.0001"),
		)
		checkEvent(bidTx, "BidAvailable", "RaribleOpenBid")
	})
})
