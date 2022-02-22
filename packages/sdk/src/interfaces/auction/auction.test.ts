import { createFlowEmulator, createTestAuth } from "@rarible/flow-test-common"
import { toBigNumber } from "@rarible/types"
import fcl from "@onflow/fcl"
import { getServiceAccountAddress } from "@rarible/flow-test-common/src"
import { createFlowTestEmulatorSdk } from "../../test/create-flow-test-sdk"
import { checkEvent } from "../../test/check-event"
import { testDelay } from "../../test/delay"
import { createLotEngAucTest } from "../../test/transactions/create-lot-eng-auc-test"
import { getContractAddress } from "../../config/utils"
import { mintRaribleNftTest } from "../../test/transactions/mint-test"
import { updateProps } from "../../blockchain-api/auction/common/update-props"

describe("Test English Auction", () => {
	createFlowEmulator({})
	const emulatorCollection = getContractAddress("emulator", "RaribleNFT")

	test("Should create RaribleNFT lot", async () => {
		const { sdk } = await createFlowTestEmulatorSdk("acc1")
		const { address: address1 } = await createFlowTestEmulatorSdk("acc2")
		const { address: address2 } = await createFlowTestEmulatorSdk("acc3")
		const mint = await mintRaribleNftTest(sdk, emulatorCollection)

		await createLotEngAucTest(
			sdk,
			emulatorCollection,
			{
				itemId: mint.tokenId,
				originFees: [{ account: address1, value: toBigNumber("0.5") }],
				payouts: [{ account: address2, value: toBigNumber("0.03") }],
			},
		)
	}, 10000)

	test("Should create RaribleNFT auction, cancel lot", async () => {
		const { sdk } = await createFlowTestEmulatorSdk("acc1")
		const { address: address1 } = await createFlowTestEmulatorSdk("acc2")
		const { address: address2 } = await createFlowTestEmulatorSdk("acc3")
		const mint = await mintRaribleNftTest(sdk, emulatorCollection)

		const tx = await createLotEngAucTest(
			sdk,
			emulatorCollection,
			{
				itemId: mint.tokenId,
				buyoutPrice: "1",
				originFees: [{ account: address1, value: toBigNumber("0.5") }],
				payouts: [{ account: address2, value: toBigNumber("0.03") }],
			},
		)

		const cancelLotTx = await sdk.auction.cancelLot({ collection: emulatorCollection, lotId: tx.lotId })
		checkEvent(cancelLotTx, "LotCompleted", "EnglishAuction")
		expect(cancelLotTx.status).toEqual(4)
	}, 10000)

	test("Should create RaribleNFT auction, create bid, complete lot ", async () => {
		const { sdk, pk } = await createFlowTestEmulatorSdk("acc1")
		const auth1 = createTestAuth(fcl, "emulator", await getServiceAccountAddress(), pk)
		const { sdk: sdk2 } = await createFlowTestEmulatorSdk("acc2")
		const mintTx = await mintRaribleNftTest(sdk, emulatorCollection)

		await updateProps(fcl, auth1, "emulator", "5")
		const tx = await createLotEngAucTest(sdk, emulatorCollection, {
			itemId: mintTx.tokenId,
			duration: "5",
			buyoutPrice: "1",
		})

		const bid = await sdk2.auction.createBid({
			collection: emulatorCollection,
			lotId: tx.lotId,
			amount: "0.1",
			originFee: [],
		})
		checkEvent(bid, "OpenBid", "EnglishAuction")

		await testDelay(6 * 1000)
		await mintRaribleNftTest(sdk, emulatorCollection)

		const cancelLotTx = await sdk.auction.completeLot({ collection: emulatorCollection, lotId: tx.lotId })
		checkEvent(cancelLotTx, "LotCompleted", "EnglishAuction")
		expect(cancelLotTx.status).toEqual(4)
	}, 100000)

	test("Should create RaribleNFT auction, create bid, increase bid, complete lot", async () => {
		const { sdk, pk } = await createFlowTestEmulatorSdk("acc1")
		const auth1 = createTestAuth(fcl, "emulator", await getServiceAccountAddress(), pk)
		const { sdk: sdk2 } = await createFlowTestEmulatorSdk("acc2")

		const mint = await mintRaribleNftTest(sdk, emulatorCollection)

		await updateProps(fcl, auth1, "emulator", "5")
		const tx = await createLotEngAucTest(sdk, emulatorCollection, {
			itemId: mint.tokenId,
			buyoutPrice: "10",
			duration: "5",
		})

		const bid = await sdk2.auction.createBid({
			collection: emulatorCollection,
			lotId: tx.lotId,
			amount: "1",
			originFee: [],
		})
		checkEvent(bid, "OpenBid", "EnglishAuction")
		const increase = await sdk2.auction.increaseBid({
			collection: emulatorCollection,
			lotId: tx.lotId,
			amount: "2",
		})
		checkEvent(increase, "IncreaseBid", "EnglishAuction")

		await testDelay(6 * 1000)
		await mintRaribleNftTest(sdk, emulatorCollection) //for generate new block

		const cancelLotTx = await sdk.auction.completeLot({ collection: emulatorCollection, lotId: tx.lotId })
		checkEvent(cancelLotTx, "LotCompleted", "EnglishAuction")
		expect(cancelLotTx.status).toEqual(4)
	}, 100000)

})
