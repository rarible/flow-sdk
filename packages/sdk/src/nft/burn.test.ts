import { createEmulatorAccount, createFlowEmulator, createTestAuth } from "@rarible/flow-test-common"
import { FLOW_TESTNET_ACCOUNT_5 } from "@rarible/flow-test-common/build/config"
import * as fcl from "@onflow/fcl"
import {FLOW_TESTNET_ACCOUNT_CLEAN} from "@rarible/flow-test-common/src/config"
import type { FlowSdk } from "../index"
import { createFlowSdk, toFlowContractAddress } from "../index"
import { checkEvent } from "../test/helpers/check-event"
import { EmulatorCollections, TestnetCollections } from "../config/config"
import { createEvolutionTestEnvironment, getEvolutionIds } from "../test/helpers/emulator/evolution"
import { createTopShotTestEnvironment, getTopShotIds } from "../test/helpers/emulator/top-shot"
import { borrowMotoGpCardId, createMotoGpTestEnvironment } from "../test/helpers/emulator/moto-gp-card"
import { extractTokenId } from "../common/item"

describe.skip("Test burn on emulator", () => {
	let sdk: FlowSdk
	createFlowEmulator({})

	beforeAll(async () => {
		const { address, pk } = await createEmulatorAccount("accountName")
		const auth = createTestAuth(fcl, "emulator", address, pk, 0)
		sdk = createFlowSdk(fcl, "emulator", {}, auth)
	})

	test.skip("Should burn NFT", async () => {
		const collection = toFlowContractAddress(EmulatorCollections.RARIBLE)
		const txMint = await sdk.nft.mint(collection, "ipfs://ipfs/QmNe7Hd9xiqm1MXPtQQjVtksvWX6ieq9Wr6kgtqFo9D4CU", [])
		const txBurn = await sdk.nft.burn(collection, extractTokenId(txMint.tokenId))
		checkEvent(txBurn, "Withdraw", "RaribleNFT")
		checkEvent(txBurn, "Destroy", "RaribleNFT")
	})

	test.skip("Should burn evolution nft", async () => {
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

	test.skip("should burn TopShot nft", async () => {
		const topShotColletion = toFlowContractAddress(EmulatorCollections.TOPSHOT)
		const { acc1, serviceAcc } = await createTopShotTestEnvironment(fcl)

		const [result] = await getTopShotIds(fcl, serviceAcc.address, acc1.address)
		expect(result).toEqual(1)

		const burnTx = await acc1.sdk.nft.burn(topShotColletion, result)
		checkEvent(burnTx, "Withdraw", "TopShot")
		checkEvent(burnTx, "MomentDestroyed", "TopShot")
	})

	test.skip("should burn MotoCpCard nft", async () => {
		const motoGpColletion = toFlowContractAddress(EmulatorCollections.MOTOGP)
		const { acc1, serviceAcc } = await createMotoGpTestEnvironment(fcl)

		const result = await borrowMotoGpCardId(fcl, serviceAcc.address, acc1.address, 1)
		expect(result.cardID).toEqual(1)

		const burnTx = await acc1.sdk.nft.burn(motoGpColletion, result.cardID)
		checkEvent(burnTx, "Withdraw", "MotoGPCard")
		checkEvent(burnTx, "Burn", "MotoGPCard")
	})

	test("should burn barbie nft", async () => {
		const testnetAuth = createTestAuth(fcl, "testnet", FLOW_TESTNET_ACCOUNT_CLEAN.address, FLOW_TESTNET_ACCOUNT_CLEAN.privKey)
		const testnetSdk = createFlowSdk(fcl, "testnet", {}, testnetAuth)
		const testnetCollection = toFlowContractAddress(TestnetCollections.BBxBarbieCard)
		const tokenId = 2

		const burnTx = await testnetSdk.nft.burn(testnetCollection, tokenId)
		checkEvent(burnTx, "Withdraw", "HWGarageCard")
		checkEvent(burnTx, "Burn", "HWGarageCard")
	}, 1000000)

	test.skip("should burn HWGaragePack nft", async () => {
		const testnetAuth = createTestAuth(fcl, "testnet", FLOW_TESTNET_ACCOUNT_5.address, FLOW_TESTNET_ACCOUNT_5.privKey)
		const testnetSdk = createFlowSdk(fcl, "testnet", {}, testnetAuth)
		const testnetCollection = toFlowContractAddress(TestnetCollections.HWGaragePack)
		const tokenId = 31

		const burnTx = await testnetSdk.nft.burn(testnetCollection, tokenId)
		checkEvent(burnTx, "Withdraw", "HWGaragePack")
		checkEvent(burnTx, "Burn", "HWGaragePack")
	}, 1000000)
})
