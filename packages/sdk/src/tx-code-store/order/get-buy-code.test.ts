import type { FlowCollectionName } from "../../common/collection"
import type { FlowCurrency } from "../../types"
import { getBuyCode } from "./get-buy-code"

describe("Get buy cadence code", () => {
	test("should replace", () => {
		const code = getBuyCode("FLOW", "RaribleNFT" as FlowCollectionName)
		expect(code.search("FlowToken")).toBeGreaterThan(0)
		expect(code.search("flowToken")).toBeGreaterThan(0)
		expect(code.search("RaribleNFT")).toBeGreaterThan(0)
	})
	test("should throw error wrong currency", () => {
		const code = () => getBuyCode("ETH" as FlowCurrency, "RaribleNFT" as FlowCollectionName)
		expect(code).toThrow(Error)
	})
})
