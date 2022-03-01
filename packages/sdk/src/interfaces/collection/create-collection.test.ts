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
import { getContractAddress } from "../../config/utils"

describe("Test create collection", () => {
	let sdk: FlowSdk
	createFlowEmulator({})

	test.skip("Should create SoftCollection on testnet", async () => {
		const testnetAuth = createTestAuth(fcl, "testnet", FLOW_TESTNET_ACCOUNT_4.address, FLOW_TESTNET_ACCOUNT_4.privKey)
		const testnetSdk = createFlowSdk(fcl, "dev", {}, testnetAuth)

		/** Create collection */
		const tx = await testCreateCollection(testnetSdk)
		console.log("tx", tx)
		expect(parseInt(tx.collectionId)).toBeGreaterThanOrEqual(0)
		expect(tx.parentId).toBeFalsy()
	}, 200000)

	test("Should create SoftCollection with and without parent id", async () => {
		const { address, pk } = await createEmulatorAccount("accountName")
		const testAuth = createTestAuth(fcl, "emulator", address, pk, 0)
		sdk = createFlowSdk(fcl, "emulator", {}, testAuth)

		const collection = getContractAddress("emulator", "SoftCollection")

		/** Create collection */
		const tx = await testCreateCollection(sdk)
		expect(tx.collectionId).toEqual("0")
		expect(tx.parentId).toBeFalsy()
		/** And create new one with parent collection Id */
		const tx2 = await testCreateCollection(sdk, toFlowContractAddress(`${collection}:${tx.collectionId}`))
		expect(tx2.parentId).toEqual(tx.collectionId)
	})

	test("should mint nft to soft collection", async () => {
		const { address, pk } = await createEmulatorAccount("accountName")
		const testAuth = createTestAuth(fcl, "emulator", address, pk, 0)
		sdk = createFlowSdk(fcl, "emulator", {}, testAuth)

		const raribleV2Collection = getContractAddress("emulator", "SoftCollection")

		const createCollectionTx = await testCreateCollection(sdk)

		const mintTx = await sdk.nft.mint(
			toFlowContractAddress(`${raribleV2Collection}:${createCollectionTx.collectionId}`),
			"ipfs://ipfs/QmNe7Hd9xiqm1MXPtQQjVtksvWX6ieq9Wr6kgtqFo9D4CU",
			[],
		)
		const mintEvent = mintTx.events.filter(e => e.type.split(".")[3] === "Minted")[0]
		expect(mintEvent.data.meta.name).toEqual("Genesis")
	}, 50000)
})
