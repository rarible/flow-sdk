import { sansPrefix, withPrefix } from "."

describe("prefix", () => {
	test("sansPrefix must return valid value", () => {
		expect(sansPrefix("0x11")).toEqual("11")
	})
	test("sansPrefix must return valid value 2", () => {
		expect(sansPrefix("11")).toEqual("11")
	})
	test("withPrefix must return valid value", () => {
		expect(withPrefix("11")).toEqual("0x11")
	})
	test("withPrefix must return valid value 2", () => {
		expect(withPrefix("0x11")).toEqual("0x11")
	})
})
