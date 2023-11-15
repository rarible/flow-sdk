import {
	createFlowEmulator,
	createTestAuth,
} from "@rarible/flow-test-common"
import * as fcl from "@onflow/fcl"
import {
	FLOW_TESTNET_ACCOUNT_5,
	FLOW_TESTNET_ACCOUNT_PYTHON,
} from "@rarible/flow-test-common/build/config"
import { toFlowAddress } from "@rarible/types"
import { createFlowSdk } from "../index"

describe("Check init mattel collections", () => {
	createFlowEmulator({})

	test("collections keys are exists", async () => {
		const testnetBuyerAuth = createTestAuth(fcl, "testnet", FLOW_TESTNET_ACCOUNT_5.address, FLOW_TESTNET_ACCOUNT_5.privKey)
		const testnetBuyerSdk = createFlowSdk(fcl, "testnet", {}, testnetBuyerAuth)

		const status = await testnetBuyerSdk.collection.checkInitCollections()
		console.log("status", status);
		[
			"FiatToken",
			"StorefrontV2",
			"HWGarageCard",
			"HWGarageCardV2",
			"HWGaragePack",
			"HWGaragePackV2",
			"BBxBarbieCard",
			"BBxBarbiePack",
			"Gamisodes",
		].forEach((key: string) => {
			expect(key in status).toBeTruthy()
		})
	}, 1000000)

	test("collections keys exists and are false for a different wallet", async () => {
		const testnetBuyerAuth = createTestAuth(
			fcl,
			"testnet",
			FLOW_TESTNET_ACCOUNT_5.address,
			FLOW_TESTNET_ACCOUNT_5.privKey
		)
		const testnetBuyerSdk = createFlowSdk(fcl, "testnet", {}, testnetBuyerAuth)

		const address = toFlowAddress(FLOW_TESTNET_ACCOUNT_PYTHON.address)
		const status = await testnetBuyerSdk.collection.checkInitCollections(address)
		console.log(status);
		(
			[
				"FiatToken",
				"StorefrontV2",
				"HWGarageCard",
				"HWGarageCardV2",
				"HWGaragePack",
				"HWGaragePackV2",
				"BBxBarbieCard",
				"BBxBarbiePack",
				"Gamisodes",
			] as Array<keyof typeof status>
		).forEach(key => {
			expect(key in status).toBeTruthy()
			expect(status[key]).toBeFalsy()
		})
	})
})
