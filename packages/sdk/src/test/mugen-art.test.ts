import { createFlowEmulator } from "@rarible/flow-test-common"
import * as fcl from "@onflow/fcl"
import { createMugenArtTestEnvironment, getMugenArtIds } from "./mugen-art"

describe("Mugen art init and mint", () => {
	createFlowEmulator({})
	test("should init accounts and mint nft item to acc1", async () => {
		const { acc1, serviceAcc } = await createMugenArtTestEnvironment(fcl)
		const ids = await getMugenArtIds(fcl, serviceAcc.address, acc1.address)
		expect(ids.length).toEqual(1)
		expect(ids[0]).toEqual(0)
	})
})
