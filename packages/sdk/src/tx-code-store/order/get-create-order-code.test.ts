import type { FlowCurrency } from "../../types"
import type { FlowCollectionName } from "../../common/collection"
import { getCreateUpdateOrderCode } from "./get-create-order-code"

describe("Get create order cadence code", () => {
	test("should replace", () => {
		const code = getCreateUpdateOrderCode("create", "FLOW", "RaribleNFT" as FlowCollectionName)
		expect(code.search("FlowToken")).toBeGreaterThan(0)
		expect(code.search("flowToken")).toBeGreaterThan(0)
		expect(code.search("RaribleNFT")).toBeGreaterThan(0)
	})
	test("should throw error wrong currency", () => {
		const code = () => getCreateUpdateOrderCode("create", "ETH" as FlowCurrency, "RaribleNFT" as FlowCollectionName)
		expect(code).toThrow(Error)
	})
})
