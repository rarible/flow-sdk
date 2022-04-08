import { toFlowAddress } from "@rarible/types"
import { createEmulatorAccount } from "@rarible/flow-test-common"
import { getFungibleBalanceSimpleHttp } from "./balance-http"

describe("Test get balance functions", () => {

	test("Sould get balance without fcl package on mainnet", async () => {
		const balance = await getFungibleBalanceSimpleHttp({
			currency: "FLOW",
			address: toFlowAddress("0x324c4173e0175672"),
			network: "mainnet",
		})
		expect(balance.split(".")[1].length).toEqual(8)
	})

	// createFlowEmulator({})
	// fcl.config()
	// 	.put("accessNode.api", "http://localhost:8888")
	test.skip("Sould get balance without fcl package", async () => {
		const { address } = await createEmulatorAccount("asd")
		const balance = await getFungibleBalanceSimpleHttp({
			currency: "FLOW",
			address: toFlowAddress(address),
			network: "emulator",
		})
		expect(balance).toEqual("10000.10100000")
	})
})
