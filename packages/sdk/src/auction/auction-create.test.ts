import {
	createEmulatorAccount,
	createFlowEmulator,
	createTestAuth,
	FLOW_TESTNET_ACCOUNT_4,
} from "@rarible/flow-test-common"
import * as fcl from "@onflow/fcl"
import { toBigNumber, toFlowAddress } from "@rarible/types"
import type { FlowSdk } from "../index"
import { createFlowSdk, toFlowContractAddress } from "../index"
import { checkEvent } from "../test/check-event"
import { EmulatorCollections, TestnetCollections } from "../config/config"
import { createFusdTestEnvironment } from "../test/setup-fusd-env"

describe("Test sell on emulator", () => {
	let sdk: FlowSdk
	createFlowEmulator({})
	const collection = toFlowContractAddress(EmulatorCollections.RARIBLE)

	beforeAll(async () => {
		const { address, pk } = await createEmulatorAccount("accountName")
		const auth = createTestAuth(fcl, "emulator", address, pk, 0)
		sdk = createFlowSdk(fcl, "emulator", {}, auth)
	})

	test.skip("Should create new sell order on testnet", async () => {
		const testnetAuth = createTestAuth(fcl, "testnet", FLOW_TESTNET_ACCOUNT_4.address, FLOW_TESTNET_ACCOUNT_4.privKey)
		const testnetSdk = createFlowSdk(fcl, "dev", {}, testnetAuth)
		const testnetCollection = toFlowContractAddress(TestnetCollections.RARIBLE)
		const mintTx = await testnetSdk.nft.mint(
			testnetCollection,
			"ipfs://ipfs/QmNe7Hd9xiqm1MXPtQQjVtksvWX6ieq9Wr6kgtqFo9D4CU",
			[{ account: toFlowAddress(FLOW_TESTNET_ACCOUNT_4.address), value: toBigNumber("0.1") }],
		)

		const orderTx = await testnetSdk.order.sell({
			collection: testnetCollection,
			currency: "FLOW",
			itemId: mintTx.tokenId,
			sellItemPrice: "1",
			originFees: [{ account: toFlowAddress(FLOW_TESTNET_ACCOUNT_4.address), value: toBigNumber("0.2") }],
		})

		expect(orderTx.orderId).toBeTruthy()

	}, 1000000)

	test("Should create RaribleNFT sell order", async () => {
		const mintTx = await sdk.nft.mint(
			collection,
			"ipfs://ipfs/QmNe7Hd9xiqm1MXPtQQjVtksvWX6ieq9Wr6kgtqFo9D4CU",
			[],
		)
		const tx = await sdk.auction.createLot({
			collection,
			currency: "FLOW",
			itemId: mintTx.tokenId,
			minimumBid: "0.0001",
			buyoutPrice: "1",
			increment: "0.0001",
			startAt: (new Date().getTime() / 1000).toString(),
			duration: "123.01",
			payouts: [],
			originFees: [],
		})
		console.log(tx.events[1].data)
		expect(tx.status).toEqual(4)
	})

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

})
