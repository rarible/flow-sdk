import * as fcl from "@onflow/fcl"
import { getFungibleBalance } from "./get-fungible-balance"

describe("Test get balance functions", () => {
	beforeAll(() => {
		fcl.config()
			.put("accessNode.api", "https://flow-access-mainnet.portto.io")
			.put("challenge.handshake", "https://flow-wallet.blocto.app/authn")
	})
	const address = "0x324c4173e0175672"
	test("Should return flow balance for account 0x324c4173e0175672 on mainnet", async () => {
		const balFlow = await getFungibleBalance(fcl, "mainnet", address, "FLOW")
		expect(balFlow.split(".")[1].length).toEqual(8)
	})
})
