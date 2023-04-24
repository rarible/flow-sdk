import {
	createTestAuth,
	FLOW_TESTNET_ACCOUNT_3,
	FLOW_TESTNET_ACCOUNT_4,
} from "@rarible/flow-test-common"
import * as fcl from "@onflow/fcl"
import { toFlowAddress } from "@rarible/types"
import { toBn } from "@rarible/utils"
import { createFlowSdk } from "../index"
import { checkEvent } from "../test/helpers/check-event"

describe("Test update sell order on emulator", () => {
	test("asd", async () => {
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
})
