import * as fcl from "@onflow/fcl"
import { createTestAuth } from "@rarible/flow-test-common"
import {FLOW_TESTNET_ACCOUNT_MAN} from "@rarible/flow-test-common"
import { createFlowSdk } from "../index"

describe("Collection setup on account", () => {
	test("setup initialized account", async () => {
		const testnetAuth = createTestAuth(fcl, "testnet", FLOW_TESTNET_ACCOUNT_MAN.address, FLOW_TESTNET_ACCOUNT_MAN.privKey)
		const testnetBuyerSdk = createFlowSdk(fcl, "testnet", {}, testnetAuth)

		const mattelCollection = await testnetBuyerSdk.collection.setupMattelCollections()
		expect(mattelCollection.status).toEqual(4)
		const gamisodesCollection = await testnetBuyerSdk.collection.setupGamisodesCollections()
		expect(gamisodesCollection.status).toEqual(4)
		const legacySetupCollections = await testnetBuyerSdk.collection.setupCollections()
		expect(legacySetupCollections.status).toEqual(4)
	}, 1000000)
})
