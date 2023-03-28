import { createEmulatorAccount, createFlowEmulator, createTestAuth } from "@rarible/flow-test-common"
import * as fcl from "@onflow/fcl"
import type { FlowSdk } from "../index"
import { createFlowSdk, toFlowContractAddress } from "../index"
import { EmulatorCollections, TestnetCollections } from "../config/config"

describe("Colelction setup on account", () => {
	let sdk: FlowSdk
	createFlowEmulator({})

	beforeAll(async () => {
		const { address, pk } = await createEmulatorAccount("accountName")
		const auth = createTestAuth(fcl, "emulator", address, pk, 0)
		sdk = createFlowSdk(fcl, "emulator", {}, auth)
	})

	test("Should init collection on account", async () => {
		const collection1 = await sdk.collection.setupAccount(toFlowContractAddress(EmulatorCollections.RARIBLE))
		expect(collection1.status).toEqual(4)
		const collection2 = await sdk.collection.setupAccount(toFlowContractAddress(EmulatorCollections.TOPSHOT))
		expect(collection2.status).toEqual(4)
		const collection3 = await sdk.collection.setupAccount(toFlowContractAddress(EmulatorCollections.MUGENNFT))
		expect(collection3.status).toEqual(4)
		const collection4 = await sdk.collection.setupAccount(toFlowContractAddress(EmulatorCollections.MOTOGP))
		expect(collection4.status).toEqual(4)
		const collection5 = await sdk.collection.setupAccount(toFlowContractAddress(EmulatorCollections.EVOLUTION))
		expect(collection5.status).toEqual(4)
		const collection6 = await sdk.collection.setupAccount(toFlowContractAddress(EmulatorCollections.CNNNFT))
		expect(collection6.status).toEqual(4)
	})

	test.skip("setup new account", async () => {
		const testnetBuyerAuth = createTestAuth(fcl, "testnet", "0x41a36288184ff09c", "29738dd5e3ad320ac3bcc7b99909d139d52c93b9d2441439c29d8e5701c301ea")
		const testnetBuyerSdk = createFlowSdk(fcl, "testnet", {}, testnetBuyerAuth)

		const collection = await testnetBuyerSdk.collection.setupAccount(
			toFlowContractAddress(TestnetCollections.HWGarageCard)
		)
		expect(collection.status).toEqual(4)
	}, 1000000)
})
