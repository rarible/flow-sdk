import * as fcl from "@onflow/fcl"
import { toFlowAddress } from "@rarible/types"
import { createEmulatorAccount, createFlowEmulator } from "@rarible/flow-test-common"
import { getFungibleBalance } from "./get-fungible-balance"

describe("Test get balance functions", () => {
	createFlowEmulator({})
	test("Should return flow balance for account 0x324c4173e0175672 on mainnet", async () => {
		const { address } = await createEmulatorAccount("testAcc")
		const balFlow = await getFungibleBalance(fcl, "emulator", toFlowAddress(address), "FLOW")
		expect(balFlow).toEqual("10000.10100000")
	})
})
