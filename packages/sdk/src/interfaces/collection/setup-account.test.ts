import { createEmulatorAccount, createFlowEmulator, createTestAuth } from "@rarible/flow-test-common"
import fcl from "@onflow/fcl"
import type { FlowSdk } from "../../index"
import { createFlowSdk, toFlowContractAddress } from "../../index"
import { getContractAddress } from "../../config/utils"

describe("Colelction setup on account", () => {
	let sdk: FlowSdk
	createFlowEmulator({})

	beforeAll(async () => {
		const { address, pk } = await createEmulatorAccount("accountName")
		const auth = createTestAuth(fcl, "emulator", address, pk, 0)
		sdk = createFlowSdk(fcl, "emulator", {}, auth)
	})

	test("Should init collection on account", async () => {
		const collection1 = await sdk.collection.setupAccount(toFlowContractAddress(getContractAddress("emulator", "RaribleNFT")))
		expect(collection1.status).toEqual(4)
		const collection2 = await sdk.collection.setupAccount(toFlowContractAddress(getContractAddress("emulator", "TopShot")))
		expect(collection2.status).toEqual(4)
		const collection3 = await sdk.collection.setupAccount(toFlowContractAddress(getContractAddress("emulator", "MugenNFT")))
		expect(collection3.status).toEqual(4)
		const collection4 = await sdk.collection.setupAccount(toFlowContractAddress(getContractAddress("emulator", "MotoGPCard")))
		expect(collection4.status).toEqual(4)
		const collection5 = await sdk.collection.setupAccount(toFlowContractAddress(getContractAddress("emulator", "Evolution")))
		expect(collection5.status).toEqual(4)
		const collection6 = await sdk.collection.setupAccount(toFlowContractAddress(getContractAddress("emulator", "CNN_NFT")))
		expect(collection6.status).toEqual(4)
	})
})
