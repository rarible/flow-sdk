import { createFlowEmulator } from "@rarible/flow-test-common"
import { toBigNumber } from "@rarible/types"
import fcl from "@onflow/fcl"
import { toFlowContractAddress, toFlowItemId } from "../index"
import { EmulatorCollections } from "../config/config"
import { createFlowTestEmulatorSdk } from "../test/helpers/emulator/create-flow-test-sdk"
import { createEvolutionTestEnvironment, getEvolutionIds } from "../test/helpers/emulator/evolution"
import { checkEvent } from "../test/helpers/check-event"
import { createTopShotTestEnvironment, getTopShotIds } from "../test/helpers/emulator/top-shot"
import { borrowMotoGpCardId, createMotoGpTestEnvironment } from "../test/helpers/emulator/moto-gp-card"
import { createMugenArtTestEnvironment, getMugenArtIds } from "../test/helpers/emulator/mugen-art"
import { getTestOrderTmplate } from "../test/helpers/order-template"

describe("Test bid on emulator", () => {
	createFlowEmulator({})
	const collection = toFlowContractAddress(EmulatorCollections.RARIBLE)

	test("Should create RaribleNFT bid order", async () => {
		const { sdk: sdk1, address: address1 } = await createFlowTestEmulatorSdk("accountName1")
		const { sdk: sdk2, address: address2 } = await createFlowTestEmulatorSdk("accountName2")
		// console.log("balance address1", await sdk1.wallet.getFungibleBalance(address1, "FLOW"))
		const mintTx = await sdk1.nft.mint(
			collection,
			"ipfs://ipfs/QmNe7Hd9xiqm1MXPtQQjVtksvWX6ieq9Wr6kgtqFo9D4CU",
			[{ account: address2, value: toBigNumber("0.12") }],
		)
		const tx = await sdk2.order.bid(
			collection,
			"FLOW",
			mintTx.tokenId,
			toBigNumber("2"),
			[], //{ account: toFlowAddress(address2), value: toBigNumber("0.03") }
		)
		expect(tx.status).toEqual(4)

		const order = getTestOrderTmplate("bid", tx.orderId, mintTx.tokenId, toBigNumber("1"))
		await sdk1.order.fill(collection, "FLOW", order, address2, [])

		const bid2 = await sdk1.order.bid(collection, "FLOW", mintTx.tokenId, toBigNumber("1"), [])
		const order2 = getTestOrderTmplate("bid", bid2.orderId, mintTx.tokenId, toBigNumber("1"))
		await sdk2.order.fill(collection, "FLOW", order2, address1, [])

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
