import type { FlowRoyalty } from "@rarible/flow-api-client"
import type { BigNumberLike, FlowAddress } from "@rarible/types"
import { FLOW_ZERO_ADDRESS, toBigNumberLike, toFlowAddress } from "@rarible/types"
import { validateRoyalties } from "./validate-royalties"

describe("Validate flow royalties", () => {
	test("Should validate flow royalties", () => {
		const royalties: FlowRoyalty[] = validateRoyalties(
			[{ account: toFlowAddress(FLOW_ZERO_ADDRESS), value: toBigNumberLike("0.1") }],
		)
		expect(royalties[0].account).toBeTruthy()
		expect(royalties[0].value).toBeTruthy()
	})

	test("Should throw error empty value", () => {
		const royalties = () => validateRoyalties(
			[{ account: toFlowAddress(FLOW_ZERO_ADDRESS), value: toBigNumberLike("") }],
		)
		expect(royalties).toThrow(Error)
	})

	test("Should throw error invalid account", () => {
		const royalties = () => validateRoyalties(
			[{ account: "" as FlowAddress, value: toBigNumberLike("0.1") }],
		)
		expect(royalties).toThrow(Error)
	})

	test("Should throw error invalid account", () => {
		const royalties = () => validateRoyalties(
			[{ account: "0x12345abcde" as FlowAddress, value: "0.1" as BigNumberLike }],
		)
		expect(royalties).toThrow(Error)
	})

	test("Should skip emty royalties", () => {
		const royalties = validateRoyalties(
			[{ account: "" as FlowAddress, value: "" as BigNumberLike }],
		)
		expect(royalties.length).toEqual(0)
	})
})
