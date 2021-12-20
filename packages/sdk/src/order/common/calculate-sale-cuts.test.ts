import { FLOW_ZERO_ADDRESS, toBigNumber, toFlowAddress } from "@rarible/types"
import type { FlowFee } from "../../types"
import { calculateSaleCuts } from "./calculate-sale-cuts"

describe("Calculate sale cuts for transaction", () => {
	const address1 = toFlowAddress("0x1111111111111111")
	const address2 = toFlowAddress("0x2222222222222222")
	const address3 = toFlowAddress("0x3333333333333333")
	const address4 = toFlowAddress("0x4444444444444444")
	test("Should convert price and fees to fess in currency", () => {
		const fees: FlowFee[] = [
			{ account: address1, value: toBigNumber("0.1") },
			{ account: address2, value: toBigNumber("0.05") },
			{ account: address3, value: toBigNumber("0.025") },
		]
		const payouts: FlowFee[] = [{ account: address4, value: toBigNumber("0.5") }]
		const cuts = calculateSaleCuts(FLOW_ZERO_ADDRESS, "0.1", fees, payouts)
		expect(cuts.length).toEqual(5)
		expect(cuts.find(a => a.account === address1)?.value).toEqual("0.01")
		expect(cuts.find(a => a.account === address2)?.value).toEqual("0.005")
		expect(cuts.find(a => a.account === address3)?.value).toEqual("0.0025")
		expect(cuts.find(a => a.account === address4)?.value).toEqual("0.04125")
		expect(cuts.find(a => a.account === FLOW_ZERO_ADDRESS)?.value).toEqual("0.04125")
	})
	test("Should convert price and fees to fess in currency and concat duplicates", () => {
		const fees: FlowFee[] = [
			{ account: address1, value: toBigNumber("0.1") },
			{ account: address2, value: toBigNumber("0.05") },
			{ account: address1, value: toBigNumber("0.025") },
			{ account: address4, value: toBigNumber("0.2") },
		]
		const cuts = calculateSaleCuts(FLOW_ZERO_ADDRESS, "0.1", fees, [])
		expect(cuts.length).toEqual(4)
		expect(cuts.find(a => a.account === address1)?.value).toEqual("0.0125")
		expect(cuts.find(a => a.account === address2)?.value).toEqual("0.005")
		expect(cuts.find(a => a.account === address4)?.value).toEqual("0.02")
		expect(cuts.find(a => a.account === FLOW_ZERO_ADDRESS)?.value).toEqual("0.0625")
	})

	test("Should convert price and fees to fess in currency mainPayout 0", () => {
		const fees: FlowFee[] = [
			{ account: address1, value: toBigNumber("0.25") },
			{ account: address2, value: toBigNumber("0.75") },
		]
		const cuts = calculateSaleCuts(FLOW_ZERO_ADDRESS, "0.1", fees, [])
		expect(cuts.length).toEqual(2)
		expect(cuts.find(a => a.account === address1)?.value).toEqual("0.025")
		expect(cuts.find(a => a.account === address2)?.value).toEqual("0.075")
	})
	test("Should throw error? comissions percents to large", () => {
		const fees: FlowFee[] = [
			{ account: address1, value: toBigNumber("0.30") },
			{ account: address2, value: toBigNumber("0.75") },
		]
		expect(() => calculateSaleCuts(FLOW_ZERO_ADDRESS, "0.1", fees, [])).toThrow(Error)
	})
})
