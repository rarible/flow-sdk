import { FLOW_ZERO_ADDRESS, toBigNumber } from "@rarible/types"
import { calculateUpdateOrderSaleCuts } from "./calculate-update-order-sale-cuts"

describe("Calculate sale cuts values for new price", () => {
	test("Should Calculate sale cuts values for new price", () => {
		const saleCutsNew = calculateUpdateOrderSaleCuts(
			"3600",
			"7200",
			[{ account: FLOW_ZERO_ADDRESS, value: toBigNumber("156.7") }],
		)
		expect(saleCutsNew[0].value).toEqual("313.4")
	})
})
