import * as fcl from "@onflow/fcl"
import { createFlowSdk } from "../index"
import {createTestAccount} from "../test/helpers/create-test-account"

describe("Colelction setup on account", () => {
	test("setup initialized account", async () => {
		const {auth} = await createTestAccount(fcl, "testnet")
		const testnetBuyerSdk = createFlowSdk(fcl, "testnet", {}, auth)

		const collection = await testnetBuyerSdk.collection.setupMattelCollections()
		expect(collection.status).toEqual(4)
	}, 1000000)
})
