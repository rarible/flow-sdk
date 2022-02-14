import { createEmulatorAccount, createFlowEmulator, createTestAuth } from "@rarible/flow-test-common"
import * as fcl from "@onflow/fcl"
import type { FlowAddress } from "@rarible/types"
import { toBigNumber, toFlowAddress } from "@rarible/types"
import type { FlowFee, FlowSdk } from "../../index"
import { createFlowSdk } from "../../index"
import { createEvolutionTestEnvironment, getEvolutionIds } from "../../test/secondary-collections/evolution"
import { createTopShotTestEnvironment, getTopShotIds } from "../../test/secondary-collections/top-shot"
import { borrowMotoGpCardId, createMotoGpTestEnvironment } from "../../test/secondary-collections/moto-gp-card"
import { createFusdTestEnvironment } from "../../test/setup-fusd-env"
import { toFlowItemId } from "../../types/item"
import { createMugenArtTestEnvironment, getMugenArtIds } from "../../test/secondary-collections/mugen-art"
import { getContractAddress } from "../../config/utils"
import { mintTest } from "../test/mint-test"
import { sellTest } from "../test/sell-test"
import { createFlowTestTestnetSdk } from "../../test/create-flow-test-sdk"

describe("Test sell function", () => {
	let sdk: FlowSdk
	let address: FlowAddress
	createFlowEmulator({})
	const collection = getContractAddress("emulator", "RaribleNFT")

	beforeAll(async () => {
		const account = await createEmulatorAccount("accountName")
		address = toFlowAddress(account.address)
		const auth = createTestAuth(fcl, "emulator", address, account.pk, 0)
		sdk = createFlowSdk(fcl, "emulator", {}, auth)
	})

	test.skip("Should create new sell order on testnet", async () => {
		const [testAccount] = createFlowTestTestnetSdk(fcl, "staging")
		const testnetCollection = getContractAddress("testnet", "RaribleNFT")

		const royalties = [{ account: testAccount.address, value: toBigNumber("0.1") }]
		const mintTx = await mintTest(testAccount.sdk, testnetCollection, royalties)

		const originFees = [{ account: testAccount.address, value: toBigNumber("0.2") }]
		await sellTest(fcl, testAccount.sdk, "testnet", testnetCollection, "FLOW", mintTx.tokenId, "1", originFees)
	}, 1000000)

	test("Should create RaribleNFT sell order on emulator and check commissions", async () => {
		const mintTx = await mintTest(sdk, collection)
		await sellTest(fcl, sdk, "emulator", collection, "FLOW", mintTx.tokenId)

		// with additional payouts
		const account = await createEmulatorAccount("accountName1")
		const payouts: FlowFee[] = [{ account: toFlowAddress(account.address), value: toBigNumber("0.1") }]
		await sellTest(fcl, sdk, "emulator", collection, "FLOW", mintTx.tokenId, "2", payouts)

		//with origin fees
		const account2 = await createEmulatorAccount("accountName2")
		const originFees: FlowFee[] = [{ account: toFlowAddress(account2.address), value: toBigNumber("0.23") }]
		await sellTest(fcl, sdk, "emulator", collection, "FLOW", mintTx.tokenId, "3.123", payouts, originFees)
		//todo write test with royalties when we e2e is being created
	})

	test("Should create RaribleNFT sell order for FUSD", async () => {
		const { acc1 } = await createFusdTestEnvironment(fcl, "emulator")
		const mintTx = await mintTest(acc1.sdk, collection)
		await sellTest(fcl, acc1.sdk, "emulator", collection, "FUSD", mintTx.tokenId)
	})

	test("Should create sell order from evolution nft", async () => {
		const { acc1, serviceAcc } = await createEvolutionTestEnvironment(fcl)

		const result = await getEvolutionIds(fcl, serviceAcc.address, acc1.address, acc1.tokenId)
		expect(result.data.itemId).toEqual(1)
		const evolutionCollection = getContractAddress("emulator", "Evolution")

		await sellTest(fcl, acc1.sdk, "emulator", evolutionCollection, "FLOW", toFlowItemId(`${evolutionCollection}:1`))
	})

	test("Should create sell order from TopShot nft", async () => {
		const topShotColletion = getContractAddress("emulator", "TopShot")
		const { acc1, serviceAcc } = await createTopShotTestEnvironment(fcl)

		const [result] = await getTopShotIds(fcl, serviceAcc.address, acc1.address)
		expect(result).toEqual(1)

		await sellTest(fcl, acc1.sdk, "emulator", topShotColletion, "FLOW", toFlowItemId(`${topShotColletion}:${result}`))
	})

	test("Should create sell order from MotoCpCard nft", async () => {
		const motoGpColletion = getContractAddress("emulator", "MotoGPCard")
		const { acc1, serviceAcc } = await createMotoGpTestEnvironment(fcl)

		const result = await borrowMotoGpCardId(fcl, serviceAcc.address, acc1.address, 1)
		expect(result.cardID).toEqual(1)

		await sellTest(fcl, acc1.sdk, "emulator", motoGpColletion, "FLOW", toFlowItemId(`${motoGpColletion}:${result.cardID}`))
	})

	test("Should create sell order from MugenArt nft", async () => {
		const mugenArtCollection = getContractAddress("emulator", "MugenNFT")
		const { acc1, serviceAcc } = await createMugenArtTestEnvironment(fcl)

		const [id] = await getMugenArtIds(fcl, serviceAcc.address, acc1.address)
		expect(id).toEqual(0)

		await sellTest(fcl, acc1.sdk, "emulator", mugenArtCollection, "FLOW", toFlowItemId(`${mugenArtCollection}:${id}`))
	})
})
