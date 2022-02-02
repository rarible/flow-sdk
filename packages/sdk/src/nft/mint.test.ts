import * as fcl from "@onflow/fcl"
import {
	createEmulatorAccount,
	createFlowEmulator,
	createTestAuth,
	getServiceAccountAddress,
} from "@rarible/flow-test-common"
import { toFlowAddress } from "@rarible/types"
import type { FlowContractAddress, FlowSdk } from "../index"
import { createFlowSdk, toFlowContractAddress } from "../index"
import { createEvolutionTestEnvironment, getEvolutionIds } from "../test/secondary-collections/evolution"
import { createTopShotTestEnvironment, getTopShotIds } from "../test/secondary-collections/top-shot"
import { borrowMotoGpCardId, createMotoGpTestEnvironment } from "../test/secondary-collections/moto-gp-card"
import { createMugenArtTestEnvironment, getMugenArtIds } from "../test/secondary-collections/mugen-art"
import { getCollectionId } from "../config/config"
import { createFlowTestEmulatorSdk } from "../test/create-flow-test-sdk"
import { testCreateCollection } from "../test/collection/test-create-collection"

describe("Minting on emulator", () => {
	let sdk: FlowSdk
	createFlowEmulator({})

	beforeAll(async () => {
		const { address, pk } = await createEmulatorAccount("accountName")
		const auth = createTestAuth(fcl, "emulator", address, pk, 0)
		sdk = createFlowSdk(fcl, "emulator", {}, auth)
	})

	test("should mint nft", async () => {
		const contract = getCollectionId("emulator", "RaribleNFT")
		const mintTx = await sdk.nft.mint(
			contract, "ipfs://ipfs/QmNe7Hd9xiqm1MXPtQQjVtksvWX6ieq9Wr6kgtqFo9D4CU", [])
		expect(mintTx.status).toEqual(4)
	})

	test("should mint nft to soft collection", async () => {
		const softCollection = getCollectionId("emulator", "SoftCollection")
		const raribleV2Collection = getCollectionId("emulator", "RaribleNFTv2")
		const { sdk: testSdk, address, pk } = await createFlowTestEmulatorSdk("Test")
		const serviceAddress = await getServiceAccountAddress()
		const serviceAuth = createTestAuth(fcl, "emulator", serviceAddress, pk, 0)
		const serviceSdk = createFlowSdk(fcl, "emulator", {}, serviceAuth)

		//todo move initialization to main transaction when new create collection tx is come
		await testSdk.collection.setupAccount(softCollection)
		await serviceSdk.collection.setupAccount(softCollection)
		await testSdk.collection.setupAccount(raribleV2Collection)
		await serviceSdk.collection.setupAccount(raribleV2Collection)

		const createCollectionTx = await testCreateCollection(serviceSdk, toFlowAddress(address))

		const mintTx = await testSdk.nft.mint(
			`${raribleV2Collection}.${createCollectionTx.collectionId}` as FlowContractAddress, "ipfs://ipfs/QmNe7Hd9xiqm1MXPtQQjVtksvWX6ieq9Wr6kgtqFo9D4CU", [])
		const mintEvent = mintTx.events.filter(e => e.type.split(".")[3] === "Minted")[0]
		expect(mintEvent.data.meta.name).toEqual("Genesis")
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


	test("should init accounts and mint nft item to acc1", async () => {
		const { acc1, serviceAcc } = await createMugenArtTestEnvironment(fcl)
		const ids = await getMugenArtIds(fcl, serviceAcc.address, acc1.address)
		expect(ids.length).toEqual(1)
		expect(ids[0]).toEqual(0)
	})
})
