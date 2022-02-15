import { toFlowAddress } from "@rarible/types"

describe("to-flow-address", () => {
	it("should correctly parse flow address", () => {
		expect(toFlowAddress("0x55ad22f01ef568a1")).toStrictEqual("0x55ad22f01ef568a1")
	})

	it("should correctly parse flow address", () => {
		expect(toFlowAddress("55ad22f01ef568a1")).toStrictEqual("0x55ad22f01ef568a1")
	})

	it("should invalidate wrong flow address", () => {
		expect(() => toFlowAddress("0xД5ad22f01ef568a1")).toThrow()
	})
})
