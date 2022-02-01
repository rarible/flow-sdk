import { createEmulatorAccount, createFlowEmulator, createTestAuth } from "@rarible/flow-test-common"
import * as fcl from "@onflow/fcl"
import type { FlowSdk } from "../index"
import { createFlowSdk } from "../index"

describe("Test fill on emulator", () => {
	let sdk: FlowSdk
	createFlowEmulator({})

	test("Should fill RaribleNFT order for FLOW tokens", async () => {
		const { address, pk } = await createEmulatorAccount("accountName")
		const auth = createTestAuth(fcl, "emulator", address, pk, 0)
		sdk = createFlowSdk(fcl, "emulator", {}, auth)
		const mintTx = await sdk.nft.createCollection({
			name: "TestCollection",
			symbol: "TST",
			royalties: [],
		})
		console.log(mintTx)
		expect(mintTx.status).toEqual(4)
	})
})
