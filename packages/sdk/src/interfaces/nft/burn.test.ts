import { createEmulatorAccount, createFlowEmulator, createTestAuth } from "@rarible/flow-test-common"
import fcl from "@onflow/fcl"
import type { FlowSdk } from "../../index"
import { createFlowSdk } from "../../index"
import { checkEvent } from "../../test/check-event"
import { createEvolutionTestEnvironment, getEvolutionIds } from "../../test/secondary-collections/evolution"
import { createTopShotTestEnvironment, getTopShotIds } from "../../test/secondary-collections/top-shot"
import { borrowMotoGpCardId, createMotoGpTestEnvironment } from "../../test/secondary-collections/moto-gp-card"
import { extractTokenId } from "../../types/item"
import { getContractAddress } from "../../config/utils"
import { mintTest } from "../test/mint-test"

describe("Test burn on emulator", () => {
	let sdk: FlowSdk
	const collection = getContractAddress("emulator", "RaribleNFT")
	createFlowEmulator({})

	beforeAll(async () => {
		const { address, pk } = await createEmulatorAccount("accountName")
		const auth = createTestAuth(fcl, "emulator", address, pk, 0)
		sdk = createFlowSdk(fcl, "emulator", {}, auth)
	})

	test("Should burn NFT", async () => {
		const txMint = await mintTest(sdk, collection)
		const txBurn = await sdk.nft.burn(collection, extractTokenId(txMint.tokenId))
		checkEvent(txBurn, "Withdraw", "RaribleNFT")
		checkEvent(txBurn, "Destroy", "RaribleNFT")
	})

	test("Should burn evolution nft", async () => {
		const { acc1, serviceAcc } = await createEvolutionTestEnvironment(fcl)

		const result = await getEvolutionIds(fcl, serviceAcc.address, acc1.address, acc1.tokenId)
		expect(result.data.itemId).toEqual(1)

		const burnTx = await acc1.sdk.nft.burn(
			getContractAddress("emulator", "Evolution"), 1,
		)
		expect(burnTx.status).toEqual(4)
		checkEvent(burnTx, "Withdraw", "Evolution")
		checkEvent(burnTx, "CollectibleDestroyed", "Evolution")
	})

	test("should burn TopShot nft", async () => {
		const topShotColletion = getContractAddress("emulator", "TopShot")
		const { acc1, serviceAcc } = await createTopShotTestEnvironment(fcl)

		const [result] = await getTopShotIds(fcl, serviceAcc.address, acc1.address)
		expect(result).toEqual(1)

		const burnTx = await acc1.sdk.nft.burn(topShotColletion, result)
		checkEvent(burnTx, "Withdraw", "TopShot")
		checkEvent(burnTx, "MomentDestroyed", "TopShot")
	})

	test("should burn MotoCpCard nft", async () => {
		const motoGpColletion = getContractAddress("emulator", "MotoGPCard")
		const { acc1, serviceAcc } = await createMotoGpTestEnvironment(fcl)

		const result = await borrowMotoGpCardId(fcl, serviceAcc.address, acc1.address, 1)
		expect(result.cardID).toEqual(1)

		const burnTx = await acc1.sdk.nft.burn(motoGpColletion, result.cardID)
		checkEvent(burnTx, "Withdraw", "MotoGPCard")
		checkEvent(burnTx, "Burn", "MotoGPCard")
	})
})
