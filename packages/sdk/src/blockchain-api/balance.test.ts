import { FLOW_ZERO_ADDRESS } from "@rarible/types"
import * as fcl from "@onflow/fcl"
import type { FlowCurrency } from "../types/types"
import { getBalanceCode } from "./balance"

describe("getBalanceCode  test", () => {
	test("getBalanceCode: Should get FUSD code", () => {
		const code = getBalanceCode(fcl, "FUSD", FLOW_ZERO_ADDRESS)
		expect(code.cadence.length).toBeGreaterThan(0)
	})
	test("getBalanceCode: Should get FLOW code", () => {
		const code = getBalanceCode(fcl, "FLOW", FLOW_ZERO_ADDRESS)
		expect(code.cadence.length).toBeGreaterThan(0)
	})
	test("getBalanceCode: Should throw error", () => {
		const code = () => getBalanceCode(fcl, "ETH" as FlowCurrency, FLOW_ZERO_ADDRESS)
		expect(code).toThrowError("Unsupported currency")
	})
})
