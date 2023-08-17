import * as fcl from "@onflow/fcl"
import { toFlowAddress } from "@rarible/types"
import {
	createEmulatorAccount,
	createFlowEmulator,
	createTestAuth,
	FLOW_TESTNET_ACCOUNT_3,
} from "@rarible/flow-test-common"
import {
	FLOW_TESTNET_ACCOUNT_9,
} from "@rarible/flow-test-common/build/config"
import {toBn} from "@rarible/utils"
import {createFlowSdk} from "../index"
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

describe("Test get balance on testnet", () => {
	test("get flow token balance", async () => {
		const testnetAuth = createTestAuth(fcl, "testnet", FLOW_TESTNET_ACCOUNT_3.address, FLOW_TESTNET_ACCOUNT_3.privKey)
		const testnetSdk = createFlowSdk(fcl, "testnet", {}, testnetAuth)
		const recipient = FLOW_TESTNET_ACCOUNT_9.address

		const startBalance = await testnetSdk.wallet.getFungibleBalance(toFlowAddress(recipient), "FLOW")
		console.log("st", startBalance.toString())
		expect(toBn(startBalance).gt(0)).toBeTruthy()
	})

	test("get fusd token balance", async () => {
		const testnetAuth = createTestAuth(fcl, "testnet", FLOW_TESTNET_ACCOUNT_3.address, FLOW_TESTNET_ACCOUNT_3.privKey)
		const testnetSdk = createFlowSdk(fcl, "testnet", {}, testnetAuth)
		const recipient = FLOW_TESTNET_ACCOUNT_9.address

		const startBalance = await testnetSdk.wallet.getFungibleBalance(toFlowAddress(recipient), "FUSD")
		expect(startBalance).toBe("0.00000000")
	})

	test("get usdc token balance", async () => {
		const testnetAuth = createTestAuth(fcl, "testnet", FLOW_TESTNET_ACCOUNT_3.address, FLOW_TESTNET_ACCOUNT_3.privKey)
		const testnetSdk = createFlowSdk(fcl, "testnet", {}, testnetAuth)
		const recipient = FLOW_TESTNET_ACCOUNT_9.address

		const startBalance = await testnetSdk.wallet.getFungibleBalance(toFlowAddress(recipient), "USDC")
		expect(toBn(startBalance).gt(0)).toBeTruthy()
	})

	test("get usdc token balance for not init account", async () => {
		const testnetAuth = createTestAuth(fcl, "testnet", FLOW_TESTNET_ACCOUNT_3.address, FLOW_TESTNET_ACCOUNT_3.privKey)
		const testnetSdk = createFlowSdk(fcl, "testnet", {}, testnetAuth)
		const recipient = "0xd094add66eaec79c"

		const startBalance = await testnetSdk.wallet.getFungibleBalance(toFlowAddress(recipient), "USDC")
		expect(startBalance).toBe("0.00000000")
	})
})
