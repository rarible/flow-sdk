import { FLOW_ZERO_ADDRESS, toBigNumber, toFlowAddress } from "@rarible/types"
import { prepareFees } from "./convert-fee-to-cadence"

describe("prepareFees", () => {
	test("should convert FlowFee[] fcl.arg object", () => {
		expect(prepareFees([{ account: toFlowAddress(FLOW_ZERO_ADDRESS), value: toBigNumber("0.1") }]))
			.toStrictEqual([{
				key: FLOW_ZERO_ADDRESS,
				value: "0.1",
			}])
		expect(prepareFees([{ account: toFlowAddress(FLOW_ZERO_ADDRESS), value: toBigNumber("0") }]))
			.toStrictEqual([])
	})
})
