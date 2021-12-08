import { createEmulatorAccount, createFlowEmulator, createTestAuth } from "@rarible/flow-test-common"
import fcl from "@onflow/fcl"
import { createFlowSdk } from "../index"

describe("Get protocol fee", () => {
	createFlowEmulator({})
	test("should get protocol fees", async () => {
		const { address, pk } = await createEmulatorAccount("accountName1")
		const auth = createTestAuth(fcl, "emulator", address, pk, 0)
		const sdk = createFlowSdk(fcl, "emulator", {}, auth)
		const fees = await sdk.order.getProtocolFee()
		expect(fees.buyerFee.value).toBeTruthy()
		expect(fees.buyerFee.account).toBeTruthy()
		expect(fees.sellerFee.value).toBeTruthy()
		expect(fees.sellerFee.account).toBeTruthy()
	})
})
