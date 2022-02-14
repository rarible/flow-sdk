import * as fcl from "@onflow/fcl"
import { createEmulatorAccount, createFlowEmulator, createTestAuth } from "@rarible/flow-test-common"
import type { FlowSdk } from "../../index"
import { createFlowSdk, toFlowContractAddress } from "../../index"
import { createEvolutionTestEnvironment, getEvolutionIds } from "../../test/secondary-collections/evolution"
import { createTopShotTestEnvironment, getTopShotIds } from "../../test/secondary-collections/top-shot"
import { borrowMotoGpCardId, createMotoGpTestEnvironment } from "../../test/secondary-collections/moto-gp-card"
import { createMugenArtTestEnvironment, getMugenArtIds } from "../../test/secondary-collections/mugen-art"
import { testCreateCollection } from "../../test/collection/test-create-collection"
import { getContractAddress } from "../../config/utils"
import { mintTest } from "../test/mint-test"

describe("Minting on emulator", () => {
	let sdk: FlowSdk
	createFlowEmulator({})

	beforeAll(async () => {
		const { address, pk } = await createEmulatorAccount("accountName")
		const auth = createTestAuth(fcl, "emulator", address, pk, 0)
		sdk = createFlowSdk(fcl, "emulator", {}, auth)
	})

	test("should mint nft", async () => {
		const contract = getContractAddress("emulator", "RaribleNFT")
		await mintTest(sdk, contract)
	})

	test("should mint nft to soft collection", async () => {
		const raribleV2Collection = getContractAddress("emulator", "RaribleNFTv2")

		const createCollectionTx = await testCreateCollection(sdk)
		const softCollection = toFlowContractAddress(`${raribleV2Collection}:${createCollectionTx.collectionId}`)
		const mintTx = await mintTest(sdk, softCollection)
		const mintEvent = mintTx.events.filter(e => e.type.split(".")[3] === "Minted")[0]
		expect(mintEvent.data.meta.name).toEqual("Genesis")
	})

	test("should throw error invalid collection", async () => {
		expect.assertions(1)
		try {
			const contract = toFlowContractAddress("A.0x0000000000000000.CustomCollection")
			await mintTest(sdk, contract)
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


	test("should init accounts and mint nft item to acc1", async () => {
		const { acc1, serviceAcc } = await createMugenArtTestEnvironment(fcl)
		const ids = await getMugenArtIds(fcl, serviceAcc.address, acc1.address)
		expect(ids.length).toEqual(1)
		expect(ids[0]).toEqual(0)
	})
})
