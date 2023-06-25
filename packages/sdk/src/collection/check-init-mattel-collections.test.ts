import {
	createFlowEmulator,
	createTestAuth,
} from "@rarible/flow-test-common"
import * as fcl from "@onflow/fcl"
import { FLOW_TESTNET_ACCOUNT_5 } from "@rarible/flow-test-common/build/config"
import { createFlowSdk } from "../index"

describe("Check init mattel collections", () => {
	createFlowEmulator({})

	test("collections keys are exists", async () => {
		const testnetBuyerAuth = createTestAuth(fcl, "testnet", FLOW_TESTNET_ACCOUNT_5.address, FLOW_TESTNET_ACCOUNT_5.privKey)
		const testnetBuyerSdk = createFlowSdk(fcl, "testnet", {}, testnetBuyerAuth)

		const status = await testnetBuyerSdk.collection.checkInitMattelCollections();
		[
			"FUSD",
			"FiatToken",
			"StorefrontV2",
			"HWGarageCard",
			"HWGarageCardV2",
			"HWGaragePack",
			"HWGaragePackV2",
			"BBxBarbieCard",
			"BBxBarbiePack",
		].forEach((key: string) => {
			expect(key in status).toBeTruthy()
		})
	}, 1000000)
})
