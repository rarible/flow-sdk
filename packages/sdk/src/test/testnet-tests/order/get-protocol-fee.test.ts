import { createFlowTestTestnetSdk } from "../../helpers/testnet/create-flow-test-testnet-sdk"
import { getProtocolFee } from "../../../order/get-protocol-fee"

describe.skip("Get protocol fee", () => {
	const [{ sdk }] = createFlowTestTestnetSdk()
	test("should get protocol fees", async () => {
		const fees = sdk.order.getProtocolFee()
		expect(fees.buyerFee.value).toEqual("0")
		expect(fees.buyerFee.account).toBeTruthy()
		expect(fees.sellerFee.value).toEqual("0")
		expect(fees.sellerFee.account).toBeTruthy()

		const percentFees = getProtocolFee.percents("testnet")
		expect(percentFees.buyerFee.value).toEqual("0")
		expect(percentFees.buyerFee.account).toEqual("0xebf4ae01d1284af8")
		expect(percentFees.sellerFee.value).toEqual("0")
		expect(percentFees.sellerFee.account).toEqual("0xebf4ae01d1284af8")
	})
})
