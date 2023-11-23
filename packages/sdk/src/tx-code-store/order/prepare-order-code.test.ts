import type { FlowCurrency, NonFungibleContract } from "../../types"
import {openBidTransactionCode} from "../../scripts/bid/bid"
import { prepareOrderCode } from "./prepare-order-code"

describe("Get bid cadence code", () => {
	test("should replace", () => {
		const code = prepareOrderCode(openBidTransactionCode.openBid, "RaribleNFT", "FLOW")
		expect(code.search("FlowToken")).toBeGreaterThan(0)
		expect(code.search("flowToken")).toBeGreaterThan(0)
		expect(code.search("RaribleNFT")).toBeGreaterThan(0)
	})
	test("should throw error wrong currency", () => {
		const code = () => prepareOrderCode(openBidTransactionCode.openBid, "RaribleNFT", "ETH" as FlowCurrency)
		expect(code).toThrow(Error)
	})
	test("should throw error wrong collection", () => {
		const code = () => prepareOrderCode(openBidTransactionCode.openBid, "RaribleNF" as NonFungibleContract, "FLOW")
		expect(code).toThrow(Error)
	})
})
