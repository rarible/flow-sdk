import * as fcl from "@onflow/fcl"
import { createTestAuth } from "@rarible/flow-test-common"
import { createEmulatorAccount, createFlowEmulator } from "@rarible/flow-test-common/src"
import type { FlowSdk } from "../index"
import { createFlowSdk } from "../index"
import { EmulatorCollections } from "../config"
import { toFlowContractAddress } from "../common/flow-address"

describe("Minting on emulator", () => {
	let sdk: FlowSdk
	createFlowEmulator({})

	beforeAll(async () => {
		const { address, pk } = await createEmulatorAccount("accountName")
		const auth = createTestAuth(fcl, "emulator", address, pk, 0)
		sdk = createFlowSdk(fcl, "emulator", auth)
	})

	test("should mint nft", async () => {
		const contract = toFlowContractAddress(EmulatorCollections.RARIBLE)
		const mintTx = await sdk.nft.mint(
			contract, "ipfs://ipfs/QmNe7Hd9xiqm1MXPtQQjVtksvWX6ieq9Wr6kgtqFo9D4CU", [])
		expect(mintTx.status).toEqual(4)
	})

	test("should throw error invalid collection", async () => {
		expect.assertions(1)
		try {
			const contract = toFlowContractAddress("A.0x0000000000000000.CustomCollection")
			await sdk.nft.mint(contract, "ipfs://ipfs/QmNe7Hd9xiqm1MXPtQQjVtksvWX6ieq9Wr6kgtqFo9D4CU", [])
		} catch (e) {
			expect(e).toBeInstanceOf(Error)
		}
	})
})
