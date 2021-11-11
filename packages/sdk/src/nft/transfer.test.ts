import { createTestAuth } from "@rarible/flow-test-common"
import fcl from "@onflow/fcl"
import { createEmulatorAccount, createFlowEmulator } from "@rarible/flow-test-common/src"
import type { FlowSdk } from "../index"
import { createFlowSdk } from "../index"
import { checkEvent } from "../test/check-event"
import { EmulatorCollections } from "../config"
import { toFlowAddress, toFlowContractAddress } from "../common/flow-address"
import { createEvolutionTestEnvironment, getEvolutionIds } from "../test/evolution"
import { createTopShotTestEnvironment, getTopShotIds } from "../test/top-shot"

describe("Test transfer on emulator", () => {
	let sdk: FlowSdk
	const collection = toFlowContractAddress(EmulatorCollections.RARIBLE)
	createFlowEmulator({})

	test("Should transfer NFT", async () => {
		const { address, pk } = await createEmulatorAccount("accountName")
		const auth = createTestAuth(fcl, "emulator", address, pk, 0)
		sdk = createFlowSdk(fcl, "emulator", auth)

		const mintTx = await sdk.nft.mint(collection, "ipfs://ipfs/QmNe7Hd9xiqm1MXPtQQjVtksvWX6ieq9Wr6kgtqFo9D4CU", [])
		const tx = await sdk.nft.transfer(collection, mintTx.tokenId, toFlowAddress(address))

		checkEvent(tx, "Withdraw", "RaribleNFT")
		checkEvent(tx, "Deposit", "RaribleNFT")
	})

	test("Should transfer evolution nft", async () => {
		const { acc1, acc2, serviceAcc } = await createEvolutionTestEnvironment(fcl)

		const result = await getEvolutionIds(fcl, serviceAcc.address, acc1.address, acc1.tokenId)
		expect(result.data.itemId).toEqual(1)

		const transferTx = await acc1.sdk.nft.transfer(
			toFlowContractAddress(EmulatorCollections.EVOLUTION), 1, toFlowAddress(acc2.address),
		)
		expect(transferTx.status).toEqual(4)
		checkEvent(transferTx, "Withdraw", "Evolution")
		checkEvent(transferTx, "Deposit", "Evolution")
	})

	test("Should transfer TopShot nft", async () => {
		const topShotColletion = toFlowContractAddress(EmulatorCollections.TOPSHOT)
		const { acc1, acc2, serviceAcc } = await createTopShotTestEnvironment(fcl)

		const [result] = await getTopShotIds(fcl, serviceAcc.address, acc1.address)
		expect(result).toEqual(1)

		const transferTx = await acc1.sdk.nft.transfer(topShotColletion, result, toFlowAddress(acc2.address))
		checkEvent(transferTx, "Withdraw", "TopShot")
		checkEvent(transferTx, "Deposit", "TopShot")
	})
})
