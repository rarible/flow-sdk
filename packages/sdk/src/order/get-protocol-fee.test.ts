import { createEmulatorAccount, createFlowEmulator, createTestAuth } from "@rarible/flow-test-common"
import fcl from "@onflow/fcl"
import { createFlowSdk } from "../index"
import { getProtocolFee } from "./get-protocol-fee"

describe("Get protocol fee", () => {
	createFlowEmulator({})
	test("should get protocol fees", async () => {
		const { address, pk } = await createEmulatorAccount("accountName1")
		const auth = createTestAuth(fcl, "emulator", address, pk, 0)
		const sdk = createFlowSdk(fcl, "emulator", {}, auth)
		const fees = sdk.order.getProtocolFee()
		expect(fees.buyerFee.value).toEqual("50")
		expect(fees.buyerFee.account).toBeTruthy()
		expect(fees.sellerFee.value).toEqual("50")
		expect(fees.sellerFee.account).toBeTruthy()

		const percentFees = getProtocolFee.percents("testnet")
		expect(percentFees.buyerFee.value).toEqual("0.005")
		expect(percentFees.buyerFee.account).toEqual("0xebf4ae01d1284af8")
		expect(percentFees.sellerFee.value).toEqual("0.005")
		expect(percentFees.sellerFee.account).toEqual("0xebf4ae01d1284af8")
	})
})
