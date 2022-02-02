import { checkPrice } from "./check-price"

describe("Check price", () => {
	test("Should check valid price", () => {
		checkPrice("123")
	})
	test("Should check valid price", () => {
		checkPrice("1.0002")
	})
	test("Should check valid price", () => {
		checkPrice("0.0001")
	})
	test("Should check invalid price", () => {
		expect(() => checkPrice("0.00001")).toThrow(Error)
	})
	test("Should check invalid price", () => {
		expect(() => checkPrice("0.00000001")).toThrow(Error)
	})
})
