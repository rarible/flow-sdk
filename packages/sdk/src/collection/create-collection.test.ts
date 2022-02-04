import { createEmulatorAccount, createFlowEmulator, createTestAuth } from "@rarible/flow-test-common"
import * as fcl from "@onflow/fcl"
import type { FlowSdk } from "../index"
import { createFlowSdk, toFlowContractAddress } from "../index"
import { getCollectionId } from "../config/config"
import { testCreateCollection } from "../test/collection/test-create-collection"

describe("Test fill on emulator", () => {
	let sdk: FlowSdk
	createFlowEmulator({})

	test("Should create SoftCollection with and without parent id", async () => {
		const { address, pk } = await createEmulatorAccount("accountName")
		const testAuth = createTestAuth(fcl, "emulator", address, pk, 0)
		sdk = createFlowSdk(fcl, "emulator", {}, testAuth)

		const collection = getCollectionId("emulator", "SoftCollection")

		/** Create collection */
		const tx = await testCreateCollection(sdk)
		expect(tx.collectionId).toEqual(0)
		expect(tx.parentId).toBeFalsy()
		/** And create new one with parentId */
		const tx2 = await testCreateCollection(sdk, toFlowContractAddress(`${collection}.${tx.collectionId}`))
		expect(tx2.parentId).toEqual(tx.collectionId)
	})
})
