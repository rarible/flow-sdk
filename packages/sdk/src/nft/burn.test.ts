import { createTestAuth } from "@rarible/flow-test-common"
import fcl from "@onflow/fcl"
import { createEmulatorAccount, createFlowEmulator } from "@rarible/flow-test-common/src"
import type { FlowSdk } from "../index"
import { createFlowSdk } from "../index"
import { checkEvent } from "../test/check-event"
import { EmulatorCollections } from "../config"
import { toFlowContractAddress } from "../common/flow-address"
import { createEvolutionTestEnvironment, getEvolutionIds } from "../test/evolution"
import { createTopShotTestEnvironment, getTopShotIds } from "../test/top-shot"

describe("Test burn on emulator", () => {
	let sdk: FlowSdk
	const collection = toFlowContractAddress(EmulatorCollections.RARIBLE)
	createFlowEmulator({})

	beforeAll(async () => {
		const { address, pk } = await createEmulatorAccount("accountName")
		const auth = createTestAuth(fcl, "emulator", address, pk, 0)
		sdk = createFlowSdk(fcl, "emulator", auth)
	})

	test("Should burn NFT", async () => {
		const txMint = await sdk.nft.mint(collection, "ipfs://ipfs/QmNe7Hd9xiqm1MXPtQQjVtksvWX6ieq9Wr6kgtqFo9D4CU", [])
		const txBurn = await sdk.nft.burn(collection, txMint.tokenId)
		checkEvent(txBurn, "Withdraw", "RaribleNFT")
		checkEvent(txBurn, "Destroy", "RaribleNFT")
	})

	test("Should burn evolution nft", async () => {
		const { acc1, serviceAcc } = await createEvolutionTestEnvironment(fcl)

		const result = await getEvolutionIds(fcl, serviceAcc.address, acc1.address, acc1.tokenId)
		expect(result.data.itemId).toEqual(1)

		const burnTx = await acc1.sdk.nft.burn(
			toFlowContractAddress(EmulatorCollections.EVOLUTION), 1,
		)
		expect(burnTx.status).toEqual(4)
		checkEvent(burnTx, "Withdraw", "Evolution")
		checkEvent(burnTx, "CollectibleDestroyed", "Evolution")
	})

	test("should burn TopShot nft", async () => {
		const topShotColletion = toFlowContractAddress(EmulatorCollections.TOPSHOT)
		const { acc1, serviceAcc } = await createTopShotTestEnvironment(fcl)

		const [result] = await getTopShotIds(fcl, serviceAcc.address, acc1.address)
		expect(result).toEqual(1)

		const burnTx = await acc1.sdk.nft.burn(topShotColletion, result)
		checkEvent(burnTx, "Withdraw", "TopShot")
		checkEvent(burnTx, "MomentDestroyed", "TopShot")
	})
})
