import type { FlowRoyalty } from "@rarible/flow-api-client"
import type { BigNumber, FlowAddress } from "@rarible/types"
import { FLOW_ZERO_ADDRESS, toBigNumber, toFlowAddress } from "@rarible/types"
import { validateRoyalties } from "./validate-royalties"

describe("Validate flow royalties", () => {
	test("Should validate flow royalties", () => {
		const royalties: FlowRoyalty[] = validateRoyalties(
			[{ account: toFlowAddress(FLOW_ZERO_ADDRESS), value: toBigNumber("0.1") }],
		)
		expect(royalties[0].account).toBeTruthy()
		expect(royalties[0].value).toBeTruthy()
	})

	test("Should throw error empty value", () => {
		const royalties = () => validateRoyalties(
			[{ account: toFlowAddress(FLOW_ZERO_ADDRESS), value: toBigNumber("") }],
		)
		expect(royalties).toThrow(Error)
	})

	test("Should throw error invalid account", () => {
		const royalties = () => validateRoyalties(
			[{ account: "" as FlowAddress, value: toBigNumber("0.1") }],
		)
		expect(royalties).toThrow(Error)
	})

	test("Should throw error invalid account", () => {
		const royalties = () => validateRoyalties(
			[{ account: "0x12345abcde" as FlowAddress, value: "0.1" as BigNumber }],
		)
		expect(royalties).toThrow(Error)
	})
})
