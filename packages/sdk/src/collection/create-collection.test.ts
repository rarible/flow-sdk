import {
	createEmulatorAccount,
	createFlowEmulator,
	createTestAuth,
	getServiceAccountAddress,
} from "@rarible/flow-test-common"
import * as fcl from "@onflow/fcl"
import { toFlowAddress } from "@rarible/types"
import type { FlowSdk } from "../index"
import { createFlowSdk, toFlowContractAddress } from "../index"
import { getCollectionId } from "../config/config"
import { testCreateCollection } from "../test/collection/test-create-collection"

describe("Test fill on emulator", () => {
	let sdk: FlowSdk
	let serviceSdk: FlowSdk
	createFlowEmulator({})

	test("Should fill RaribleNFT order for FLOW tokens", async () => {
		const { address, pk } = await createEmulatorAccount("accountName")
		const testAuth = createTestAuth(fcl, "emulator", address, pk, 0)
		sdk = createFlowSdk(fcl, "emulator", {}, testAuth)
		const serviceAddress = await getServiceAccountAddress()
		const serviceAuth = createTestAuth(fcl, "emulator", serviceAddress, pk, 0)
		serviceSdk = createFlowSdk(fcl, "emulator", {}, serviceAuth)

		const collection = getCollectionId("emulator", "SoftCollection")

		await sdk.collection.setupAccount(collection)
		await serviceSdk.collection.setupAccount(collection)

		const tx = await testCreateCollection(serviceSdk, toFlowAddress(address))
		const tx2 = await testCreateCollection(serviceSdk, toFlowAddress(address), toFlowContractAddress(`${collection}.${tx.collectionId}`))
		expect(tx2.parentId).toEqual(tx.collectionId)

	})
})
