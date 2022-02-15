import { createEmulatorAccount, createFlowEmulator, createTestAuth } from "@rarible/flow-test-common"
import * as fcl from "@onflow/fcl"
import type { FlowSdk } from "../../index"
import { createFlowSdk } from "../../index"
import { testCreateCollection } from "../../test/collection/test-create-collection"
import { parseEvents } from "../../common/parse-tx-events"

describe("Test update collection", () => {
	let sdk: FlowSdk
	createFlowEmulator({})

	test("Should update SoftCollection", async () => {
		const { address, pk } = await createEmulatorAccount("accountName")
		const testAuth = createTestAuth(fcl, "emulator", address, pk, 0)
		sdk = createFlowSdk(fcl, "emulator", {}, testAuth)

		const tx = await testCreateCollection(sdk)
		expect(tx.parentId).toBeFalsy()

		const metaNew = {
			icon: "http://new.icon",
			description: "new description",
			url: "htp://new.url",
		}

		const tx2 = await sdk.collection.updateCollection({
			collectionIdNumber: tx.collectionId,
			...metaNew,

		})
		const meta: any = parseEvents(tx2.events, "Changed", "meta")
		expect(tx2.collectionId).toEqual(tx.collectionId)
		expect(meta.icon).toEqual(metaNew.icon)
		expect(meta.description).toEqual(metaNew.description)
		expect(meta.url).toEqual(metaNew.url)
	})
})
