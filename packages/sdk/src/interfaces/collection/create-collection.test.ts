import {
	createEmulatorAccount,
	createFlowEmulator,
	createTestAuth,
	FLOW_TESTNET_ACCOUNT_4,
} from "@rarible/flow-test-common"
import * as fcl from "@onflow/fcl"
import type { FlowSdk } from "../../index"
import { createFlowSdk, toFlowContractAddress } from "../../index"
import { testCreateCollection } from "../../test/collection/test-create-collection"
import { mintTest } from "../test/mint-test"
import { sellTest } from "../test/sell-test"
import { bidTest } from "../test/bid-test"

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
		const mintTx = await mintTest(sdk, collectionId)

		await sellTest(fcl, sdk, "emulator", collectionId, "FLOW", mintTx.tokenId)
		await bidTest(sdk, collectionId, "FLOW", mintTx.tokenId)
	}, 50000)

	test.skip("should mint nft to soft collection and sell on testnet", async () => {
		const testnetAuth = createTestAuth(fcl, "testnet", FLOW_TESTNET_ACCOUNT_4.address, FLOW_TESTNET_ACCOUNT_4.privKey)
		const testnetSdk = createFlowSdk(fcl, "dev", {}, testnetAuth)

		const { collectionId } = await testCreateCollection(testnetSdk)
		const mintTx = await mintTest(testnetSdk, collectionId)

		const { orderId } = await sellTest(fcl, sdk, "testnet", collectionId, "FLOW", mintTx.tokenId)
		expect(orderId).toBeGreaterThanOrEqual(0)
		await bidTest(testnetSdk, collectionId, "FLOW", mintTx.tokenId)
	}, 2000000)
})
