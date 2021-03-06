import { createEmulatorAccount, createFlowEmulator, createTestAuth } from "@rarible/flow-test-common"
import fcl from "@onflow/fcl"
import type { FlowSdk } from "../index"
import { createFlowSdk, toFlowContractAddress } from "../index"
import { checkEvent } from "../test/helpers/check-event"
import { EmulatorCollections } from "../config/config"
import { createEvolutionTestEnvironment, getEvolutionIds } from "../test/helpers/emulator/evolution"
import { createTopShotTestEnvironment, getTopShotIds } from "../test/helpers/emulator/top-shot"
import { borrowMotoGpCardId, createMotoGpTestEnvironment } from "../test/helpers/emulator/moto-gp-card"
import { extractTokenId } from "../common/item"

describe("Test burn on emulator", () => {
	let sdk: FlowSdk
	const collection = toFlowContractAddress(EmulatorCollections.RARIBLE)
	createFlowEmulator({})

	beforeAll(async () => {
		const { address, pk } = await createEmulatorAccount("accountName")
		const auth = createTestAuth(fcl, "emulator", address, pk, 0)
		sdk = createFlowSdk(fcl, "emulator", {}, auth)
	})

	test("Should burn NFT", async () => {
		const txMint = await sdk.nft.mint(collection, "ipfs://ipfs/QmNe7Hd9xiqm1MXPtQQjVtksvWX6ieq9Wr6kgtqFo9D4CU", [])
		const txBurn = await sdk.nft.burn(collection, extractTokenId(txMint.tokenId))
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

	test("should burn MotoCpCard nft", async () => {
		const motoGpColletion = toFlowContractAddress(EmulatorCollections.MOTOGP)
		const { acc1, serviceAcc } = await createMotoGpTestEnvironment(fcl)

		const result = await borrowMotoGpCardId(fcl, serviceAcc.address, acc1.address, 1)
		expect(result.cardID).toEqual(1)

		const burnTx = await acc1.sdk.nft.burn(motoGpColletion, result.cardID)
		checkEvent(burnTx, "Withdraw", "MotoGPCard")
		checkEvent(burnTx, "Burn", "MotoGPCard")
	})
})
