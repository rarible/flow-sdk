import {
	createTestAuth,
	FLOW_TESTNET_ACCOUNT_3,
	FLOW_TESTNET_ACCOUNT_4,
} from "@rarible/flow-test-common"
import * as fcl from "@onflow/fcl"
import { toFlowAddress } from "@rarible/types"
import { toBn } from "@rarible/utils"
import {FLOW_TESTNET_ACCOUNT_11, FLOW_TESTNET_ACCOUNT_8} from "@rarible/flow-test-common/build/config"
import {createFlowSdk} from "../index"
import { checkEvent } from "../test/helpers/check-event"
import {createTestSdk} from "../test/helpers/create-test-sdk"

describe("Test update sell order on emulator", () => {
	test("transfer flow token", async () => {
		const testnetAuth = createTestAuth(fcl, "testnet", FLOW_TESTNET_ACCOUNT_3.address, FLOW_TESTNET_ACCOUNT_3.privKey)
		const testnetSdk = createFlowSdk(fcl, "testnet", {}, testnetAuth)
		const recipient = FLOW_TESTNET_ACCOUNT_4.address

		const startBalance = await testnetSdk.wallet.getFungibleBalance(toFlowAddress(recipient), "FLOW")

		const transferTx = await testnetSdk.wallet.transferFunds({
			recipient: toFlowAddress(recipient),
			amount: "0.001",
			currency: "FLOW",
		})
		checkEvent(transferTx, "TokensWithdrawn", "FlowToken")

		const finishBalance = await testnetSdk.wallet.getFungibleBalance(toFlowAddress(recipient), "FLOW")
		const diffWalletBalance = toBn(finishBalance).minus(startBalance).toString()
		expect(diffWalletBalance).toEqual("0.001")
	})

	test("transfer usdc (fiat) token", async () => {
		const testnetAuth = createTestAuth(
			fcl,
			"testnet",
			FLOW_TESTNET_ACCOUNT_11.address,
			FLOW_TESTNET_ACCOUNT_11.privKey
		)
		const testnetSdk = createFlowSdk(fcl, "testnet", {}, testnetAuth)
		const recipient = FLOW_TESTNET_ACCOUNT_8.address

		await createTestSdk(fcl, FLOW_TESTNET_ACCOUNT_8).wallet.setupVault()

		const startBalance = await testnetSdk.wallet.getFungibleBalance(toFlowAddress(recipient), "USDC")

		const transferTx = await testnetSdk.wallet.transferFunds({
			recipient: toFlowAddress(recipient),
			amount: "1",
			currency: "USDC",
		})
		checkEvent(transferTx, "TokensWithdrawn", "FlowToken")

		const finishBalance = await testnetSdk.wallet.getFungibleBalance(toFlowAddress(recipient), "USDC")
		const diffWalletBalance = toBn(finishBalance).minus(startBalance).toString()
		expect(diffWalletBalance).toEqual("0.00001")

	})

	test("transfer fusd token", async () => {
		const testnetAuth = createTestAuth(
			fcl,
			"testnet",
			FLOW_TESTNET_ACCOUNT_11.address,
			FLOW_TESTNET_ACCOUNT_11.privKey
		)
		const testnetSdk = createFlowSdk(fcl, "testnet", {}, testnetAuth)
		const recipient = FLOW_TESTNET_ACCOUNT_8.address

		await createTestSdk(fcl, FLOW_TESTNET_ACCOUNT_8).wallet.setupVault()

		const startBalance = await testnetSdk.wallet.getFungibleBalance(toFlowAddress(recipient), "FUSD")

		const transferTx = await testnetSdk.wallet.transferFunds({
			recipient: toFlowAddress(recipient),
			amount: "1",
			currency: "FUSD",
		})
		checkEvent(transferTx, "TokensWithdrawn", "FlowToken")

		const finishBalance = await testnetSdk.wallet.getFungibleBalance(toFlowAddress(recipient), "FUSD")
		const diffWalletBalance = toBn(finishBalance).minus(startBalance).toString()
		expect(diffWalletBalance).toEqual("0.00001")

	})
})
