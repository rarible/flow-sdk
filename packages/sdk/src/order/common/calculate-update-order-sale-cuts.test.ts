import { FLOW_ZERO_ADDRESS, toBigNumber, toFlowAddress } from "@rarible/types"
import { calculateUpdateOrderSaleCuts } from "./calculate-update-order-sale-cuts"

describe("Calculate sale cuts values for new price", () => {
	const address1 = toFlowAddress("0x1111111111111111")
	const address2 = toFlowAddress("0x2222222222222222")
	const address3 = toFlowAddress("0x3333333333333333")
	const address4 = toFlowAddress("0x4444444444444444")
	test("Should Calculate sale cuts values for new price", () => {
		const saleCutsNew = calculateUpdateOrderSaleCuts(
			"3600",
			"7200",
			[{ account: FLOW_ZERO_ADDRESS, value: toBigNumber("156.7") }],
		)
		expect(saleCutsNew[0].value).toEqual("313.4")
	})
	test("Should Calculate sale cuts values for new price", () => {
		const saleCutsNew = calculateUpdateOrderSaleCuts(
			"100",
			"200",
			[
				{ account: address1, value: toBigNumber("50.0") },
				{ account: address2, value: toBigNumber("0.5") },
				{ account: address3, value: toBigNumber("3.0") },
				{ account: address4, value: toBigNumber("46.5") },
			],
		)
		expect(saleCutsNew[0].value).toEqual("100")
	})
})
