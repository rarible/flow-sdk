import * as fcl from "@onflow/fcl"
import { createTestAuth } from "@rarible/flow-test-common"
import {FLOW_TESTNET_ACCOUNT_PANDA} from "@rarible/flow-test-common/build/config"
import { createFlowSdk } from "../index"

describe("Colelction setup on account", () => {
	test("setup initialized account", async () => {
		const testnetAuth = createTestAuth(fcl, "testnet", FLOW_TESTNET_ACCOUNT_PANDA.address, FLOW_TESTNET_ACCOUNT_PANDA.privKey)
		const testnetBuyerSdk = createFlowSdk(fcl, "testnet", {}, testnetAuth)

		const collection = await testnetBuyerSdk.collection.setupMattelCollections()
		expect(collection.status).toEqual(4)
	}, 1000000)
})
