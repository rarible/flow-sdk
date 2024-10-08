import { createEmulatorAccount, createFlowEmulator, createTestAuth } from "@rarible/flow-test-common"
import * as fcl from "@onflow/fcl"
import { toFlowAddress } from "@rarible/types"
import {
	FLOW_TESTNET_ACCOUNT_5,
	FLOW_TESTNET_ACCOUNT_6, FLOW_TESTNET_ACCOUNT_CLEAN,
} from "@rarible/flow-test-common"
import {FLOW_TESTNET_ACCOUNT_MAN} from "@rarible/flow-test-common"
import { createFlowSdk, toFlowContractAddress } from "../index"
import { checkEvent } from "../test/helpers/check-event"
import { EmulatorCollections, TestnetCollections } from "../config/config"
import { createEvolutionTestEnvironment, getEvolutionIds } from "../test/helpers/emulator/evolution"
import { createTopShotTestEnvironment, getTopShotIds } from "../test/helpers/emulator/top-shot"
import { borrowMotoGpCardId, createMotoGpTestEnvironment } from "../test/helpers/emulator/moto-gp-card"
import { extractTokenId } from "../common/item"

describe("Test transfer on emulator", () => {
	const collection = toFlowContractAddress(EmulatorCollections.RARIBLE)
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

	test("should burn MotoCpCard nft", async () => {
		const motoGpColletion = toFlowContractAddress(EmulatorCollections.MOTOGP)
		const { acc1, acc2, serviceAcc } = await createMotoGpTestEnvironment(fcl)

		const result = await borrowMotoGpCardId(fcl, serviceAcc.address, acc1.address, 1)
		expect(result.cardID).toEqual(1)

		const transferTx = await acc1.sdk.nft.transfer(motoGpColletion, result.cardID, toFlowAddress(acc2.address))
		checkEvent(transferTx, "Withdraw", "MotoGPCard")
		checkEvent(transferTx, "Deposit", "MotoGPCard")
	})

	test.skip("should transfer HWGaragePack", async () => {
		const testnetBuyerAuth = createTestAuth(fcl, "testnet", FLOW_TESTNET_ACCOUNT_6.address, FLOW_TESTNET_ACCOUNT_6.privKey)
		const testnetBuyerSdk = createFlowSdk(fcl, "testnet", {}, testnetBuyerAuth)

		const testnetCollection = toFlowContractAddress(TestnetCollections.HWGaragePack)
		const tokenId = 30
		const transferTx = await testnetBuyerSdk.nft.transfer(
			testnetCollection,
			tokenId,
			toFlowAddress(FLOW_TESTNET_ACCOUNT_5.address)
		)
		checkEvent(transferTx, "Withdraw", "HWGaragePack")
		checkEvent(transferTx, "Deposit", "HWGaragePack")
	}, 1000000)

	test.skip("should transfer HWGarageCard", async () => {
		const testnetBuyerAuth = createTestAuth(fcl, "testnet", FLOW_TESTNET_ACCOUNT_6.address, FLOW_TESTNET_ACCOUNT_6.privKey)
		const testnetBuyerSdk = createFlowSdk(fcl, "testnet", {}, testnetBuyerAuth)

		const testnetCollection = toFlowContractAddress(TestnetCollections.HWGarageCard)
		const tokenId = 155
		const transferTx = await testnetBuyerSdk.nft.transfer(
			testnetCollection,
			tokenId,
			toFlowAddress(FLOW_TESTNET_ACCOUNT_5.address)
		)
		checkEvent(transferTx, "Withdraw", "HWGarageCard")
		checkEvent(transferTx, "Deposit", "HWGarageCard")
	}, 1000000)

	test("should transfer HWGarageCardV2", async () => {
		const testnetBuyerAuth = createTestAuth(fcl, "testnet", FLOW_TESTNET_ACCOUNT_CLEAN.address, FLOW_TESTNET_ACCOUNT_CLEAN.privKey)
		const testnetBuyerSdk = createFlowSdk(fcl, "testnet", {}, testnetBuyerAuth)

		const testnetCollection = toFlowContractAddress(TestnetCollections.HWGarageCardV2)
		const tokenId = 180
		const transferTx = await testnetBuyerSdk.nft.transfer(
			testnetCollection,
			tokenId,
			toFlowAddress(FLOW_TESTNET_ACCOUNT_MAN.address)
		)
		console.log("tra", transferTx)
		checkEvent(transferTx, "Withdraw", "HWGarageCardV2")
		checkEvent(transferTx, "Deposit", "HWGarageCardV2")
	}, 1000000)

	test("should transfer BarbiePack", async () => {
		const testnetBuyerAuth = createTestAuth(fcl, "testnet", FLOW_TESTNET_ACCOUNT_5.address, FLOW_TESTNET_ACCOUNT_5.privKey)
		const testnetBuyerSdk = createFlowSdk(fcl, "testnet", {}, testnetBuyerAuth)

		const testnetCollection = toFlowContractAddress(TestnetCollections.BBxBarbiePack)
		const tokenId = 27
		const transferTx = await testnetBuyerSdk.nft.transfer(
			testnetCollection,
			tokenId,
			toFlowAddress("0x9d23622aa6ea2728")
		)
		checkEvent(transferTx, "Withdraw", "BBxBarbiePack")
		checkEvent(transferTx, "Deposit", "BBxBarbiePack")
	}, 1000000)

	test("should transfer BarbieCard", async () => {
		const testnetBuyerAuth = createTestAuth(fcl, "testnet", FLOW_TESTNET_ACCOUNT_CLEAN.address, FLOW_TESTNET_ACCOUNT_CLEAN.privKey)
		const testnetBuyerSdk = createFlowSdk(fcl, "testnet", {}, testnetBuyerAuth)

		const testnetCollection = toFlowContractAddress(TestnetCollections.BBxBarbieCard)
		const tokenId = 1
		const transferTx = await testnetBuyerSdk.nft.transfer(
			testnetCollection,
			tokenId,
			toFlowAddress(FLOW_TESTNET_ACCOUNT_MAN.address)
		)
		console.log("tx", transferTx)
		checkEvent(transferTx, "Withdraw", "BBxBarbieCard")
		checkEvent(transferTx, "Deposit", "BBxBarbieCard")
	}, 1000000)
})
