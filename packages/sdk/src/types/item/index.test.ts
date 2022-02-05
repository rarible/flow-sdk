import { toFlowItemId } from "./index"

describe("toFlowItemId function: Test Flow item id", () => {
	test("Should test", () => {
		expect(toFlowItemId("A.ebf4ae01d1284af8.RaribleNFT:1110")).toBeTruthy()
		expect(toFlowItemId("A.ebf4ae01d1284af8.RaribleNFT:0")).toBeTruthy()
		expect(toFlowItemId("A.ebf4ae01d1284af8.RaribleNFTv2:0")).toBeTruthy()
		expect(toFlowItemId("A.ebf4ae01d1284af8.RaribleNFT_v2:0")).toBeTruthy()
		expect(toFlowItemId("A.0xebf4ae01d1284af8.RaribleNFT_v2:0")).toBeTruthy()
	})
})
