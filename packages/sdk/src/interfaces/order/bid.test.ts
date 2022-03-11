import { toBigNumber } from "@rarible/types"
import fcl from "@onflow/fcl"
import { createFlowEmulator } from "@rarible/flow-test-common"
import type { FlowFee } from "../../index"
import { toFlowItemId } from "../../index"
import { createFlowTestEmulatorSdk } from "../../test/create-flow-test-sdk"
import { createEvolutionTestEnvironment, getEvolutionIds } from "../../test/secondary-collections/evolution"
import { createTopShotTestEnvironment, getTopShotIds } from "../../test/secondary-collections/top-shot"
import { borrowMotoGpCardId, createMotoGpTestEnvironment } from "../../test/secondary-collections/moto-gp-card"
import { createMugenArtTestEnvironment, getMugenArtIds } from "../../test/secondary-collections/mugen-art"
import { getTestOrderTmplate } from "../../test/order-template"
import { getContractAddress } from "../../config/utils"
import { mintTest } from "../test/mint-test"
import { bidTest } from "../test/bid-test"

describe("Test bid on emulator", () => {
	createFlowEmulator({})
	const collection = getContractAddress("emulator", "RaribleNFT")

	test("Should create RaribleNFT bid order", async () => {
		const { sdk: sdk1, address: address1 } = await createFlowTestEmulatorSdk("accountName1")
		const { sdk: sdk2, address: address2 } = await createFlowTestEmulatorSdk("accountName2")

		const royalties = [{ account: address2, value: toBigNumber("0.12") }]
		const mintTx = await mintTest(sdk1, collection, royalties)
		const bidTx = await bidTest(sdk2, collection, "FLOW", mintTx.tokenId, toBigNumber("2"), [])

		const order = getTestOrderTmplate("bid", bidTx.orderId, mintTx.tokenId, toBigNumber("1"))
		await sdk1.order.fill(collection, "FLOW", order, address2, [])

		const originFees: FlowFee[] = [{ account: address1, value: toBigNumber("0.12") }]
		const bid2 = await bidTest(sdk1, collection, "FLOW", mintTx.tokenId, "1", originFees)
		const order2 = getTestOrderTmplate("bid", bid2.orderId, mintTx.tokenId, toBigNumber("1"))
		await sdk2.order.fill(collection, "FLOW", order2, address1, [])
	})

	test("Should create bid order from evolution nft", async () => {
		const evolutionCollection = getContractAddress("emulator", "Evolution")
		const { acc1, acc2, serviceAcc } = await createEvolutionTestEnvironment(fcl)

		const result = await getEvolutionIds(fcl, serviceAcc.address, acc1.address, acc1.tokenId)
		expect(result.data.itemId).toEqual(1)
		await bidTest(acc2.sdk, evolutionCollection, "FLOW", toFlowItemId(`${evolutionCollection}:1`), "0.0001")
	})

	test("Should create sell order from TopShot nft", async () => {
		const topShotColletion = getContractAddress("emulator", "TopShot")
		const { acc1, serviceAcc } = await createTopShotTestEnvironment(fcl)

		const [result] = await getTopShotIds(fcl, serviceAcc.address, acc1.address)
		expect(result).toEqual(1)
		await bidTest(acc1.sdk, topShotColletion, "FLOW", toFlowItemId(`${topShotColletion}:${result}`), "0.0001")
	})

	test("Should create sell order from MotoCpCard nft", async () => {
		const motoGpColletion = getContractAddress("emulator", "MotoGPCard")
		const { acc1, serviceAcc } = await createMotoGpTestEnvironment(fcl)

		const result = await borrowMotoGpCardId(fcl, serviceAcc.address, acc1.address, 1)
		expect(result.cardID).toEqual(1)

		await bidTest(
			acc1.sdk,
			motoGpColletion,
			"FLOW",
			toFlowItemId(`${motoGpColletion}:${result.cardID}`),
			"0.0001",
		)
	})
	test("Should create sell order from MugenArt nft", async () => {
		const mugenArtCollection = getContractAddress("emulator", "MugenNFT")
		const { acc1, serviceAcc } = await createMugenArtTestEnvironment(fcl)

		const [id] = await getMugenArtIds(fcl, serviceAcc.address, acc1.address)
		expect(id).toEqual(0)

		await bidTest(
			acc1.sdk,
			mugenArtCollection,
			"FLOW",
			toFlowItemId(`${mugenArtCollection}:${id}`),
			"0.0001",
		)
	})
})
