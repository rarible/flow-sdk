import { createEmulatorAccount, createFlowEmulator, createTestAuth } from "@rarible/flow-test-common"
import * as fcl from "@onflow/fcl"
import { toBigNumber, toFlowAddress } from "@rarible/types"
import type { FlowSdk } from "../../index"
import { createFlowSdk } from "../../index"
import { testCreateCollection } from "../../test/collection/test-create-collection"
import { updateCollectionTest } from "../test/update-collection-test"

describe("Test update collection", () => {
	let sdk: FlowSdk
	createFlowEmulator({})

	test("Should update SoftCollection", async () => {
		const { address, pk } = await createEmulatorAccount("accountName")
		const testAuth = createTestAuth(fcl, "emulator", address, pk, 0)
		sdk = createFlowSdk(fcl, "emulator", {}, testAuth)

		const tx = await testCreateCollection(sdk)
		expect(tx.parentId).toBeFalsy()

		await updateCollectionTest(sdk, tx.collectionId)

		const royalties = [{ account: toFlowAddress(address), value: toBigNumber("0.0") }]
		await updateCollectionTest(sdk, tx.collectionId, royalties)

		const brokenRoyalties = [{ account: toFlowAddress(address), value: toBigNumber("") }]
		await expect(updateCollectionTest(sdk, tx.collectionId, brokenRoyalties))
			.rejects
			.toThrow("Royalties: value field is undefined")
	})
})
