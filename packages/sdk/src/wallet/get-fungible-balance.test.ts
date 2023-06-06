import * as fcl from "@onflow/fcl"
import { toFlowAddress } from "@rarible/types"
import { createEmulatorAccount, createFlowEmulator } from "@rarible/flow-test-common"
import { getFungibleBalance } from "./get-fungible-balance"
import { getFungibleBalanceSimple } from "./get-ft-balance-simple"

describe("Test get balance functions", () => {
	const address = toFlowAddress("0x324c4173e0175672")

	test("Should return flow balance for account 0x324c4173e0175672 on mainnet", async () => {
		fcl.config()
			.put("accessNode.api", "https://access-mainnet-beta.onflow.org")
			.put("challenge.handshake", "https://flow-wallet.blocto.app/authn")
		const balFlow = await getFungibleBalance(fcl, "mainnet", address, "FLOW")
		expect(balFlow.split(".")[1].length).toEqual(8)
	})

	test("Sould get balance without fcl package", async () => {
		const balance = await getFungibleBalanceSimple({
			currency: "FLOW",
			address: toFlowAddress("0x324c4173e0175672"),
			network: "mainnet",
		})
		expect(balance.split(".")[1].length).toEqual(8)
	})

	createFlowEmulator({})
	test.skip("Sould get balance without fcl package", async () => {
		const { address } = await createEmulatorAccount("asd")
		fcl.config()
			.put("accessNode.api", "http://localhost:8888")
		const balance = await getFungibleBalanceSimple({
			currency: "FLOW",
			address: toFlowAddress(address),
			network: "emulator",
		})
		expect(balance).toEqual("10000.10100000")
	})
})
