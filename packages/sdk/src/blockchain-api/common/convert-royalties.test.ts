import { FLOW_ZERO_ADDRESS, toBigNumber, toFlowAddress } from "@rarible/types"
import { convertRoyalties } from "./convert-royalties"

describe("convertRoyalties", () => {
	test("should convert FlowFee[] fcl.arg object", () => {
		expect(convertRoyalties([{ account: toFlowAddress(FLOW_ZERO_ADDRESS), value: toBigNumber("0.1") }]))
			.toStrictEqual([{
				fields: [
					{ name: "address", value: FLOW_ZERO_ADDRESS },
					{ name: "fee", value: "0.1" },
				],
			}])
		expect(convertRoyalties([{ account: toFlowAddress(FLOW_ZERO_ADDRESS), value: toBigNumber("1") }]))
			.toStrictEqual([{
				fields: [
					{ name: "address", value: FLOW_ZERO_ADDRESS },
					{ name: "fee", value: "1.0" },
				],
			}])
		expect(() => convertRoyalties([{ account: toFlowAddress(FLOW_ZERO_ADDRESS), value: toBigNumber("") }]))
			.toThrow()
	})
})
