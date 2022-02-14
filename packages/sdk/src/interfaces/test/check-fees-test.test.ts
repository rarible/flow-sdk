import { FLOW_ZERO_ADDRESS, toBigNumber, toFlowAddress } from "@rarible/types"
import type { FlowFee } from "../../types/types"
import { checkFees } from "./check-fees-test"

describe("test checkFees function", () => {
	test("expected behaviour", () => {
		const price = "10"
		const account = FLOW_ZERO_ADDRESS
		const received: FlowFee[] = [
			{ account: toFlowAddress("0x10000000000abcdef"), value: toBigNumber("1") },
			{ account: toFlowAddress("0x20000000000abcdef"), value: toBigNumber("2") },
			{ account: toFlowAddress(account), value: toBigNumber("7") },
		]
		const expected = {
			payouts: [
				{ account: toFlowAddress(account), value: toBigNumber("0.7") },
			],
			originFees: [
				{ account: toFlowAddress("0x10000000000abcdef"), value: toBigNumber("0.1") },
				{ account: toFlowAddress("0x20000000000abcdef"), value: toBigNumber("0.2") },
			],
		}

		checkFees(received, expected, account, price.toString())
	})
	test("incorrect received fees length", () => {
		const price = "10"
		const account = FLOW_ZERO_ADDRESS
		const received: FlowFee[] = [
			{ account: toFlowAddress("0x10000000000abcdef"), value: toBigNumber("1") },
			{ account: toFlowAddress(account), value: toBigNumber("7") },
		]
		const expected = {
			payouts: [
				{ account: toFlowAddress(account), value: toBigNumber("0.7") },
			],
			originFees: [
				{ account: toFlowAddress("0x10000000000abcdef"), value: toBigNumber("0.1") },
				{ account: toFlowAddress("0x20000000000abcdef"), value: toBigNumber("0.2") },
			],
		}

		const result = () => checkFees(received, expected, account, price.toString())
		expect(result).toThrow()
	})
})
