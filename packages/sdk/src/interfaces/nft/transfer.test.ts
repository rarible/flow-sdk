import { createEmulatorAccount, createFlowEmulator, createTestAuth } from "@rarible/flow-test-common"
import fcl from "@onflow/fcl"
import { toFlowAddress } from "@rarible/types"
import { checkEvent } from "../../test/check-event"
import { createEvolutionTestEnvironment, getEvolutionIds } from "../../test/secondary-collections/evolution"
import { createTopShotTestEnvironment, getTopShotIds } from "../../test/secondary-collections/top-shot"
import { borrowMotoGpCardId, createMotoGpTestEnvironment } from "../../test/secondary-collections/moto-gp-card"
import { extractTokenId } from "../../types/item"
import { createFlowSdk } from "../../index"
import { getContractAddress } from "../../config/utils"

describe("Test transfer on emulator", () => {
	const collection = getContractAddress("emulator", "RaribleNFT")
	createFlowEmulator({})

	test("Should transfer NFT", async () => {
		const { address, pk } = await createEmulatorAccount("accountName")
		const auth = createTestAuth(fcl, "emulator", address, pk, 0)
		const sdk = createFlowSdk(fcl, "emulator", {}, auth)

		const mintTx = await sdk.nft.mint(collection, "ipfs://ipfs/QmNe7Hd9xiqm1MXPtQQjVtksvWX6ieq9Wr6kgtqFo9D4CU", [])
		const tx = await sdk.nft.transfer(collection, extractTokenId(mintTx.tokenId), toFlowAddress(address))

		checkEvent(tx, "Withdraw", "RaribleNFT")
		checkEvent(tx, "Deposit", "RaribleNFT")
	})
	test("Should throw error, recipient has't initialize collection", async () => {
		const { address, pk } = await createEmulatorAccount("accountName")
		const auth = createTestAuth(fcl, "emulator", address, pk, 0)
		const sdk = createFlowSdk(fcl, "emulator", {}, auth)
		const mintTx = await sdk.nft.mint(collection, "ipfs://ipfs/QmNe7Hd9xiqm1MXPtQQjVtksvWX6ieq9Wr6kgtqFo9D4CU", [])
		try {
			await sdk.nft.transfer(collection, extractTokenId(mintTx.tokenId), toFlowAddress("0xdd05e3acd01cf833"))
		} catch (e: unknown) {
			expect((e as Error).message).toBe("The recipient has't yet initialized this collection on their account, and can't receive NFT from this collection")
		}
	})

	test("Should transfer evolution nft", async () => {
		const { acc1, acc2, serviceAcc } = await createEvolutionTestEnvironment(fcl)

		const result = await getEvolutionIds(fcl, serviceAcc.address, acc1.address, acc1.tokenId)
		expect(result.data.itemId).toEqual(1)

		const transferTx = await acc1.sdk.nft.transfer(
			getContractAddress("emulator", "Evolution"), 1, toFlowAddress(acc2.address),
		)
		expect(transferTx.status).toEqual(4)
		checkEvent(transferTx, "Withdraw", "Evolution")
		checkEvent(transferTx, "Deposit", "Evolution")
	})

	test("Should transfer TopShot nft", async () => {
		const topShotColletion = getContractAddress("emulator", "TopShot")
		const { acc1, acc2, serviceAcc } = await createTopShotTestEnvironment(fcl)

		const [result] = await getTopShotIds(fcl, serviceAcc.address, acc1.address)
		expect(result).toEqual(1)

		const transferTx = await acc1.sdk.nft.transfer(topShotColletion, result, toFlowAddress(acc2.address))
		checkEvent(transferTx, "Withdraw", "TopShot")
		checkEvent(transferTx, "Deposit", "TopShot")
	})

	test("should burn MotoCpCard nft", async () => {
		const motoGpColletion = getContractAddress("emulator", "MotoGPCard")
		const { acc1, acc2, serviceAcc } = await createMotoGpTestEnvironment(fcl)

		const result = await borrowMotoGpCardId(fcl, serviceAcc.address, acc1.address, 1)
		expect(result.cardID).toEqual(1)

		const transferTx = await acc1.sdk.nft.transfer(motoGpColletion, result.cardID, toFlowAddress(acc2.address))
		checkEvent(transferTx, "Withdraw", "MotoGPCard")
		checkEvent(transferTx, "Deposit", "MotoGPCard")
	})
})
