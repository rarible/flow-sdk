import { createFlowEmulator } from "@rarible/flow-test-common"
import { toBigNumber } from "@rarible/types"
import { toFlowContractAddress } from "../index"
import { EmulatorCollections } from "../config/config"
import { createFlowTestEmulatorSdk } from "../test/create-flow-test-sdk"
import { checkEvent } from "../test/check-event"
import { mintRaribleNftTest } from "../test/transactions/mint-test"
import { testDelay } from "../test/delay"
import { createLotEngAucTest } from "../test/transactions/create-lot-eng-auc-test"

describe("Test English Auction on emulator", () => {
	createFlowEmulator({})
	const collection = toFlowContractAddress(EmulatorCollections.RARIBLE)

	test("Should create RaribleNFT lot", async () => {
		const { sdk } = await createFlowTestEmulatorSdk("acc1")
		const { address: address1 } = await createFlowTestEmulatorSdk("acc2")
		const { address: address2 } = await createFlowTestEmulatorSdk("acc3")
		const mint = await mintRaribleNftTest(sdk, collection)

		const tx = await createLotEngAucTest(
			sdk,
			collection,
			{
				itemId: mint.tokenId,
				duration: "20",
				originFees: [{ account: address1, value: toBigNumber("0.5") }],
				payouts: [{ account: address2, value: toBigNumber("0.03") }],
			},
		)
		expect(tx.orderId).toBeTruthy()

	}, 10000)

	test("Should create RaribleNFT auction, cancel lot", async () => {
		const { sdk } = await createFlowTestEmulatorSdk("acc1")
		const { address: address1 } = await createFlowTestEmulatorSdk("acc2")
		const { address: address2 } = await createFlowTestEmulatorSdk("acc3")
		const mint = await mintRaribleNftTest(sdk, collection)

		const tx = await createLotEngAucTest(
			sdk,
			collection,
			{
				itemId: mint.tokenId,
				buyoutPrice: "1",
				duration: "20",
				originFees: [{ account: address1, value: toBigNumber("0.5") }],
				payouts: [{ account: address2, value: toBigNumber("0.03") }],
			},
		)
		expect(tx.orderId).toBeTruthy()

		const cancelLotTx = await sdk.auction.cancelLot({ collection, lotId: tx.orderId })
		checkEvent(cancelLotTx, "LotCompleted", "EnglishAuction")
		expect(cancelLotTx.status).toEqual(4)
	}, 10000)

	test("Should create RaribleNFT auction, create bid, complete lot ", async () => {
		const { sdk } = await createFlowTestEmulatorSdk("acc1")
		const { sdk: sdk2 } = await createFlowTestEmulatorSdk("acc2")
		const mintTx = await mintRaribleNftTest(sdk, collection)

		const tx = await createLotEngAucTest(sdk, collection, {
			itemId: mintTx.tokenId,
			buyoutPrice: "1",
			duration: "20",
		})
		expect(tx.orderId).toBeTruthy()

		const bid = await sdk2.auction.createBid({ collection, lotId: tx.orderId, amount: "0.1", originFee: [] })
		checkEvent(bid, "OpenBid", "EnglishAuction")

		await testDelay(61000)
		await mintRaribleNftTest(sdk, collection)

		const cancelLotTx = await sdk.auction.completeLot({ collection, lotId: tx.orderId })
		checkEvent(cancelLotTx, "LotCompleted", "EnglishAuction")
		expect(cancelLotTx.status).toEqual(4)

	}, 100000)

	test("Should create RaribleNFT auction, create bid, increase bid, complete lot", async () => {
		const { sdk } = await createFlowTestEmulatorSdk("acc1")
		const { sdk: sdk2 } = await createFlowTestEmulatorSdk("acc2")
		const mint = await mintRaribleNftTest(sdk, collection)
		debugger
		const tx = await createLotEngAucTest(sdk, collection, {
			itemId: mint.tokenId,
			buyoutPrice: "10",
			duration: "20",
		})
		expect(tx.orderId).toBeTruthy()
		debugger
		const bid = await sdk2.auction.createBid({ collection, lotId: tx.orderId, amount: "1", originFee: [] })
		checkEvent(bid, "OpenBid", "EnglishAuction")
		debugger
		const increase = await sdk2.auction.increaseBid({ collection, lotId: tx.orderId, amount: "2" })
		checkEvent(increase, "IncreaseBid", "EnglishAuction")
		debugger
		await testDelay(61000)
		await mintRaribleNftTest(sdk, collection) //for generate new block
		debugger
		const cancelLotTx = await sdk.auction.completeLot({ collection, lotId: tx.orderId })
		checkEvent(cancelLotTx, "LotCompleted", "EnglishAuction")
		expect(cancelLotTx.status).toEqual(4)
	}, 100000)

})