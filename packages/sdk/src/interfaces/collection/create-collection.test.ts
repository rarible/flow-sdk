import {
	createEmulatorAccount,
	createFlowEmulator,
	createTestAuth,
	FLOW_TESTNET_ACCOUNT_4,
} from "@rarible/flow-test-common"
import * as fcl from "@onflow/fcl"
import { toBigNumber } from "@rarible/types"
import type { FlowSdk } from "../../index"
import { createFlowSdk, toFlowContractAddress } from "../../index"
import { testCreateCollection } from "../../test/collection/test-create-collection"

describe("Test create collection", () => {
	let sdk: FlowSdk
	createFlowEmulator({})

	test.skip("Should create SoftCollection on testnet", async () => {
		const testnetAuth = createTestAuth(fcl, "testnet", FLOW_TESTNET_ACCOUNT_4.address, FLOW_TESTNET_ACCOUNT_4.privKey)
		const testnetSdk = createFlowSdk(fcl, "dev", {}, testnetAuth)

		/** Create collection */
		const tx = await testCreateCollection(testnetSdk)
		expect(parseInt(tx.collectionId)).toBeGreaterThanOrEqual(0)
		expect(tx.parentId).toBeFalsy()
	}, 200000)

	test("Should create SoftCollection with and without parent id", async () => {
		const { address, pk } = await createEmulatorAccount("accountName")
		const testAuth = createTestAuth(fcl, "emulator", address, pk, 0)
		sdk = createFlowSdk(fcl, "emulator", {}, testAuth)

		/** Create collection */
		const tx = await testCreateCollection(sdk)
		const collectionIdNumber = tx.collectionId.split(":")[1]
		expect(collectionIdNumber).toEqual("0")
		expect(tx.parentId).toBeFalsy()
		/** And create new one with parent collection Id */
		const tx2 = await testCreateCollection(sdk, toFlowContractAddress(tx.collectionId))
		expect(tx2.parentId).toEqual(tx.collectionId)
	})

	test("should mint nft to soft collection", async () => {
		const { address, pk } = await createEmulatorAccount("accountName")
		const testAuth = createTestAuth(fcl, "emulator", address, pk, 0)
		sdk = createFlowSdk(fcl, "emulator", {}, testAuth)

		const { collectionId } = await testCreateCollection(sdk)
		const mintTx = await sdk.nft.mint(
			collectionId,
			"ipfs://ipfs/QmNe7Hd9xiqm1MXPtQQjVtksvWX6ieq9Wr6kgtqFo9D4CU",
			[],
		)
		const mintEvent = mintTx.events.filter(e => e.type.split(".")[3] === "Minted")[0]
		expect(mintEvent.data.meta.name).toEqual("Genesis")
		const { orderId } = await sdk.order.sell({
			collection: collectionId,
			currency: "FLOW",
			itemId: mintTx.tokenId,
			sellItemPrice: "1",
			payouts: [],
			originFees: [],
		})
		expect(orderId).toBeGreaterThanOrEqual(0)
		const bidTx = await sdk.order.bid(collectionId, "FLOW", mintTx.tokenId, toBigNumber("1"))
		expect(bidTx.orderId).toBeGreaterThanOrEqual(0)
	}, 50000)

	test.skip("should mint nft to soft collection and sell on testnet", async () => {
		const testnetAuth = createTestAuth(fcl, "testnet", FLOW_TESTNET_ACCOUNT_4.address, FLOW_TESTNET_ACCOUNT_4.privKey)
		const testnetSdk = createFlowSdk(fcl, "dev", {}, testnetAuth)

		const { collectionId } = await testCreateCollection(testnetSdk)
		const mintTx = await testnetSdk.nft.mint(
			collectionId,
			"ipfs://ipfs/QmNe7Hd9xiqm1MXPtQQjVtksvWX6ieq9Wr6kgtqFo9D4CU",
			[],
		)
		const mintEvent = mintTx.events.filter(e => e.type.split(".")[3] === "Minted")[0]
		expect(mintEvent.data.meta.name).toEqual("Genesis")
		const { orderId } = await testnetSdk.order.sell({
			collection: collectionId,
			currency: "FLOW",
			itemId: mintTx.tokenId,
			sellItemPrice: "1",
			payouts: [],
			originFees: [],
		})
		expect(orderId).toBeGreaterThanOrEqual(0)
		const bidTx = await testnetSdk.order.bid(collectionId, "FLOW", mintTx.tokenId, toBigNumber("1"))
		expect(bidTx.orderId).toBeGreaterThanOrEqual(0)
	}, 2000000)
})
