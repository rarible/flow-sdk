import { openBidTransactionCode } from "@rarible/flow-sdk-scripts"
import type { FlowCollectionName } from "../../common/collection"
import type { FlowCurrency } from "../../types"
import { prepareOrderCode } from "./prepare-order-code"

describe("Get bid cadence code", () => {
	test("should replace", () => {
		const code = prepareOrderCode(openBidTransactionCode.openBid, "RaribleNFT" as FlowCollectionName, "FLOW")
		expect(code.search("FlowToken")).toBeGreaterThan(0)
		expect(code.search("flowToken")).toBeGreaterThan(0)
		expect(code.search("RaribleNFT")).toBeGreaterThan(0)
	})
	test("should throw error wrong currency", () => {
		const code = () => prepareOrderCode(openBidTransactionCode.openBid, "RaribleNFT" as FlowCollectionName, "ETH" as FlowCurrency)
		expect(code).toThrow(Error)
	})
	test("should throw error wrong collection", () => {
		const code = () => prepareOrderCode(openBidTransactionCode.openBid, "RaribleNF" as FlowCollectionName, "FLOW")
		expect(code).toThrow(Error)
	})
})
