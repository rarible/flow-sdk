import {
	createEmulatorAccount,
	createFlowEmulator,
	createTestAuth,
	FLOW_TESTNET_ACCOUNT_2,
	FLOW_TESTNET_ACCOUNT_3,
	FLOW_TESTNET_ACCOUNT_4,
} from "@rarible/flow-test-common"
import * as fcl from "@onflow/fcl"
import { toBigNumber, toFlowAddress } from "@rarible/types"
import { toBn } from "@rarible/utils"
import type { FlowSdk } from "../../../index"
import { createFlowSdk } from "../../../index"
import { createFusdTestEnvironment } from "../../../test/setup-fusd-env"
import { checkEvent } from "../../../test/check-event"
import { createEvolutionTestEnvironment, getEvolutionIds } from "../../../test/secondary-collections/evolution"
import { toFlowItemId } from "../../../types/item"
import { createTopShotTestEnvironment, getTopShotIds } from "../../../test/secondary-collections/top-shot"
import { borrowMotoGpCardId, createMotoGpTestEnvironment } from "../../../test/secondary-collections/moto-gp-card"
import { getOrderDetailsFromBlockchain } from "../common/get-order-details-from-blockchain"
import { getTestOrderTmplate } from "../../../test/order-template"
import { createMugenArtTestEnvironment, getMugenArtIds } from "../../../test/secondary-collections/mugen-art"
import { getContractAddress } from "../../../config/utils"
import { sellTest } from "../../test/sell-test"
import { bidTest } from "../../test/bid-test"
import { createFlowTestEmulatorSdk } from "../../../test/create-flow-test-sdk"
import { mintTest } from "../../test/mint-test"

describe("Test fill on emulator", () => {
	let sdk: FlowSdk
	createFlowEmulator({})
	const collection = getContractAddress("emulator", "RaribleNFT")

	test.skip("Should fill order on testnet", async () => {
		const testnetAuth = createTestAuth(fcl, "testnet", FLOW_TESTNET_ACCOUNT_3.address, FLOW_TESTNET_ACCOUNT_3.privKey)
		const testnetSdk = createFlowSdk(fcl, "staging", {}, testnetAuth)
		const testnetAuth2 = createTestAuth(fcl, "testnet", FLOW_TESTNET_ACCOUNT_4.address, FLOW_TESTNET_ACCOUNT_4.privKey)
		const testnetSdk2 = createFlowSdk(fcl, "staging", {}, testnetAuth2)
		const testnetCollection = getContractAddress("testnet", "RaribleNFT")
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
		const buyTx = await testnetSdk2.order.fill(
			testnetCollection,
			"FLOW",
			orderTx.orderId,
			toFlowAddress(FLOW_TESTNET_ACCOUNT_3.address),
			[],
		)

		expect(buyTx.status).toEqual(4)

	}, 1000000)

	test.skip("Should fill RaribleNFT bid order for FLOW tokens on testnet", async () => {
		const testnetAuth = createTestAuth(fcl, "testnet", FLOW_TESTNET_ACCOUNT_3.address, FLOW_TESTNET_ACCOUNT_3.privKey)
		const testnetSdk = createFlowSdk(fcl, "staging", {}, testnetAuth)
		const testnetAuth2 = createTestAuth(fcl, "testnet", FLOW_TESTNET_ACCOUNT_4.address, FLOW_TESTNET_ACCOUNT_4.privKey)
		const testnetSdk2 = createFlowSdk(fcl, "staging", {}, testnetAuth2)
		const testnetCollection = getContractAddress("testnet", "RaribleNFT")
		const acc1bal = await testnetSdk.wallet.getFungibleBalance(toFlowAddress(FLOW_TESTNET_ACCOUNT_3.address), "FLOW")
		const mintTx = await testnetSdk.nft.mint(
			testnetCollection,
			"ipfs://ipfs/QmNe7Hd9xiqm1MXPtQQjVtksvWX6ieq9Wr6kgtqFo9D4CU",
			[{ account: toFlowAddress(FLOW_TESTNET_ACCOUNT_3.address), value: toBigNumber("0.1") }],
		)
		expect(
			toBn(await testnetSdk.wallet.getFungibleBalance(toFlowAddress(FLOW_TESTNET_ACCOUNT_3.address), "FLOW")).toString(),
		).toEqual(toBn(acc1bal).minus("0.00001000").toString())
		expect(mintTx.status).toEqual(4)
		const tx = await testnetSdk2.order.bid(
			collection,
			"FLOW",
			mintTx.tokenId,
			toBigNumber("0.0001"),
			[{ account: toFlowAddress(FLOW_TESTNET_ACCOUNT_2.address), value: toBigNumber("0.1") }],
		)

		const buyTx = await testnetSdk.order.fill(collection, "FLOW", tx.orderId, FLOW_TESTNET_ACCOUNT_4.address, [{
			account: toFlowAddress(FLOW_TESTNET_ACCOUNT_4.address),
			value: toBigNumber("0.2"),
		}])
		expect(buyTx.status).toEqual(4)
	}, 1000000)

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
		const { sdk, address } = await createFlowTestEmulatorSdk("testAcc")
		const { address: address0 } = await createFlowTestEmulatorSdk("testAcc2")
		const royalties = [{ account: toFlowAddress(address0), value: toBigNumber("0.2") }]
		const originFees = [{ account: toFlowAddress(address0), value: toBigNumber("0.1") }]

		const mintTx = await mintTest(sdk, collection, royalties)

		const tx = await bidTest(sdk, collection, "FLOW", mintTx.tokenId, toBigNumber("0.0001"), originFees)

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

		const mintTx = await mintTest(acc1.sdk, collection)
		expect(mintTx.status).toEqual(4)

		const tx = await sellTest(fcl, acc1.sdk, "emulator", collection, "FUSD", mintTx.tokenId, "0.0001")

		const order = getTestOrderTmplate("sell", tx.orderId, mintTx.tokenId, toBigNumber("0.0001"))
		const buyTx = await acc2.sdk.order.fill(collection, "FUSD", order, acc1.address, [])
		checkEvent(buyTx, "ListingCompleted", "NFTStorefront")
	})

	test("Should fill an evolution nft", async () => {
		const evolutionCollection = getContractAddress("emulator", "Evolution")
		const { acc1, acc2, serviceAcc } = await createEvolutionTestEnvironment(fcl)

		const result = await getEvolutionIds(fcl, serviceAcc.address, acc1.address, acc1.tokenId)
		expect(result.data.itemId).toEqual(1)

		const itemId = toFlowItemId(`${evolutionCollection}:${result.data.itemId}`)

		const sellTx = await sellTest(fcl, acc1.sdk, "emulator", evolutionCollection, "FLOW", itemId, "0.0001")

		const order = getTestOrderTmplate("sell", sellTx.orderId, itemId, toBigNumber("0.0001"))
		const buyTx = await acc2.sdk.order.fill(evolutionCollection, "FLOW", order, acc1.address, [])
		checkEvent(buyTx, "ListingCompleted", "NFTStorefront")
		const checkNft = await getEvolutionIds(fcl, serviceAcc.address, acc2.address, acc1.tokenId)
		expect(checkNft.data.itemId).toEqual(1)
	})

	test("Should fill TopShot nft", async () => {
		const topShotColletion = getContractAddress("emulator", "TopShot")
		const { acc1, acc2, serviceAcc } = await createTopShotTestEnvironment(fcl)

		const [result] = await getTopShotIds(fcl, serviceAcc.address, acc1.address)
		expect(result).toEqual(1)

		const itemId = toFlowItemId(`${topShotColletion}:${result}`)

		const sellTx = await sellTest(fcl, acc1.sdk, "emulator", topShotColletion, "FLOW", itemId, "0.0001")

		const order = getTestOrderTmplate("sell", sellTx.orderId, itemId, toBigNumber("0.0001"))
		const buyTx = await acc2.sdk.order.fill(topShotColletion, "FLOW", order, acc1.address, [])
		checkEvent(buyTx, "ListingCompleted", "NFTStorefront")
		const [checkNft] = await getTopShotIds(fcl, serviceAcc.address, acc2.address)
		expect(checkNft).toEqual(1)
	})

	test("Should fill MotoCpCard nft", async () => {
		const motoGpColletion = getContractAddress("emulator", "MotoGPCard")
		const { acc1, acc2, serviceAcc } = await createMotoGpTestEnvironment(fcl)

		const result = await borrowMotoGpCardId(fcl, serviceAcc.address, acc1.address, 1)
		expect(result.cardID).toEqual(1)

		const itemId = toFlowItemId(`${motoGpColletion}:${result.cardID}`)

		const sellTx = await sellTest(fcl, acc1.sdk, "emulator", motoGpColletion, "FLOW", itemId, "0.0001")

		const order = getTestOrderTmplate("sell", sellTx.orderId, itemId, toBigNumber("0.0001"))
		const buyTx = await acc2.sdk.order.fill(motoGpColletion, "FLOW", order, acc1.address, [])
		checkEvent(buyTx, "ListingCompleted", "NFTStorefront")
		const buyResult = await borrowMotoGpCardId(fcl, serviceAcc.address, acc2.address, 1)
		expect(buyResult.cardID).toEqual(1)
	})

	test("Should fill sell order, MugenArt nft", async () => {
		const mugenArtCollection = getContractAddress("emulator", "MugenNFT")
		const { acc1, acc2, serviceAcc } = await createMugenArtTestEnvironment(fcl)

		const [id] = await getMugenArtIds(fcl, serviceAcc.address, acc1.address)
		expect(id).toEqual(0)

		const itemId = toFlowItemId(`${mugenArtCollection}:${id}`)

		const sellTx = await sellTest(fcl, acc1.sdk, "emulator", mugenArtCollection, "FLOW", itemId, "0.0001")

		const order = getTestOrderTmplate("sell", sellTx.orderId, itemId, toBigNumber("0.0001"))
		const buyTx = await acc2.sdk.order.fill(mugenArtCollection, "FLOW", order, acc1.address, [])
		checkEvent(buyTx, "ListingCompleted", "NFTStorefront")
		const [buyItemId] = await getMugenArtIds(fcl, serviceAcc.address, acc2.address)
		expect(buyItemId).toEqual(0)
	})
})
