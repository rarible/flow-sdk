import * as fcl from "@onflow/fcl"
import { createEmulatorAccount, createFlowEmulator, createTestAuth } from "@rarible/flow-test-common"
import type { FlowSdk } from "../index"
import { createFlowSdk, toFlowContractAddress } from "../index"
import { EmulatorCollections } from "../config/config"
import { createEvolutionTestEnvironment, getEvolutionIds } from "../test/evolution"
import { createTopShotTestEnvironment, getTopShotIds } from "../test/top-shot"
import { borrowMotoGpCardId, createMotoGpTestEnvironment } from "../test/moto-gp-card"

describe("Minting on emulator", () => {
	let sdk: FlowSdk
	createFlowEmulator({})

	beforeAll(async () => {
		const { address, pk } = await createEmulatorAccount("accountName")
		const auth = createTestAuth(fcl, "emulator", address, pk, 0)
		sdk = createFlowSdk(fcl, "emulator", {}, auth)
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

	test("should mint evolution nft", async () => {
		const { acc1, serviceAcc } = await createEvolutionTestEnvironment(fcl)

		const result = await getEvolutionIds(fcl, serviceAcc.address, acc1.address, acc1.tokenId)
		expect(result.data.itemId).toEqual(1)
	})

	test("should mint TopShot nft", async () => {
		const { acc1, serviceAcc } = await createTopShotTestEnvironment(fcl)

		const result = await getTopShotIds(fcl, serviceAcc.address, acc1.address)
		expect(result[0]).toEqual(1)
	})

	test("should mint MotoCpCard nft", async () => {
		const { acc1, serviceAcc } = await createMotoGpTestEnvironment(fcl)

		const result = await borrowMotoGpCardId(fcl, serviceAcc.address, acc1.address, 1)
		expect(result.cardID).toEqual(1)
	})
})
