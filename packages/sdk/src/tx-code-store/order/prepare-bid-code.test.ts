import type { FlowCollectionName } from "../../common/collection"
import type { FlowCurrency } from "../../types"
import { prepareBidCode } from "./prepare-bid-code"

describe("Get bid cadence code", () => {
	test("should replace", () => {
		const code = prepareBidCode("create", "RaribleNFT" as FlowCollectionName, "FLOW")
		expect(code.search("FlowToken")).toBeGreaterThan(0)
		expect(code.search("flowToken")).toBeGreaterThan(0)
		expect(code.search("RaribleNFT")).toBeGreaterThan(0)
	})
	test("should throw error wrong currency", () => {
		const code = () => prepareBidCode("create", "RaribleNFT" as FlowCollectionName, "ETH" as FlowCurrency)
		expect(code).toThrow(Error)
	})
	test("should throw error wrong collection", () => {
		const code = () => prepareBidCode("create", "RaribleNF" as FlowCollectionName, "FLOW")
		expect(code).toThrow(Error)
	})
	test("should throw error wrong collection", () => {
		const code = () => prepareBidCode("creat" as any, "RaribleNFT" as FlowCollectionName, "FLOW")
		expect(code).toThrow(Error)
	})
})
