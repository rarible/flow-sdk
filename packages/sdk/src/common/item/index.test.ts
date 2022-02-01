import { toFlowItemId } from "./index"

describe("toFlowItemId function: Test Flow item id", () => {
	test("Should ", () => {
		expect(toFlowItemId("A.ebf4ae01d1284af8.RaribleNFT:1110")).toBeTruthy()
		expect(toFlowItemId("A.ebf4ae01d1284af8.RaribleNFT:0")).toBeTruthy()
	})
})
