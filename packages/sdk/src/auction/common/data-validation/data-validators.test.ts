import { validateDecimalNumber, validateIsEmptyObject, validateIsEmptyString, validateNumber } from "./data-validators"

describe("Data validators", () => {
	test("function validateNumber: should throw empty value error", () => {
		const result = () => validateNumber("")
		expect(result).toThrow(Error)
	})
	test("function validateNumber: should throw zero value error", () => {
		const result = () => validateNumber("0")
		expect(result).toThrow(Error)
	})
	test("function validateNumber: should throw zero value error", () => {
		const result = () => validateNumber("0000000")
		expect(result).toThrow(Error)
	})
	test("function validateNumber: should throw non digit value error", () => {
		const result = () => validateNumber("1.0")
		expect(result).toThrow(Error)
	})
	test("function validateNumber: should throw non digit value error", () => {
		const result = () => validateNumber(".0")
		expect(result).toThrow(Error)
	})
	test("function validateNumber: should throw non digit value error", () => {
		const result = () => validateNumber("1.")
		expect(result).toThrow(Error)
	})
	test("function validateNumber: should throw non digit value error", () => {
		const result = () => validateNumber("f")
		expect(result).toThrow(Error)
	})
	test("function validateNumber: should success validate numbers", () => {
		const result1 = () => validateNumber("1")
		expect(result1).not.toThrow(Error)
		const result2 = () => validateNumber("1234567890")
		expect(result2).not.toThrow(Error)
	})

	test("function validateDecimalNumber: should throw empty value error", () => {
		const result = () => validateDecimalNumber("")
		expect(result).toThrow(Error)
	})
	test("function validateDecimalNumber: should throw zero value error", () => {
		const result = () => validateDecimalNumber("0.0")
		expect(result).toThrow(Error)
	})
	test("function validateDecimalNumber: should throw zero value error", () => {
		const result = () => validateDecimalNumber("0.00000000")
		expect(result).toThrow(Error)
	})
	test("function validateDecimalNumber: should throw invalid value error", () => {
		const result = () => validateDecimalNumber(".0")
		expect(result).toThrow(Error)
	})
	test("function validateDecimalNumber: should throw invalid value error", () => {
		const result = () => validateDecimalNumber("1.")
		expect(result).toThrow(Error)
	})
	test("function validateDecimalNumber: should throw invalid value error", () => {
		const result = () => validateDecimalNumber("1")
		expect(result).toThrow(Error)
	})
	test("function validateDecimalNumber: should throw invalid value error", () => {
		const result = () => validateDecimalNumber("f")
		expect(result).toThrow(Error)
	})
	test("function validateDecimalNumber: should success validate decimal numbers", () => {
		const result1 = () => validateDecimalNumber("1.0")
		expect(result1).not.toThrow(Error)
		const result2 = () => validateDecimalNumber("1.0000010")
		expect(result2).not.toThrow(Error)
		const result3 = () => validateDecimalNumber("44.1234567890")
		expect(result3).not.toThrow(Error)
	})

	test("function validateIsEmptyString: should throw epty string error", () => {
		const result = () => validateIsEmptyString("")
		expect(result).toThrow(Error)
	})
	test("function validateIsEmptyString: should success validate string", () => {
		const result = () => validateIsEmptyString("a")
		expect(result).not.toThrow(Error)
	})

	test("function validateIsEmptyObject: should throw empty object", () => {
		const result1 = () => validateIsEmptyObject({})
		expect(result1).toThrow(Error)
		const result2 = () => validateIsEmptyObject([])
		expect(result2).toThrow(Error)
	})
	test("function validateIsEmptyObject: should success validate object", () => {
		const result1 = () => validateIsEmptyObject({ a: 1 })
		expect(result1).not.toThrow(Error)
		const result2 = () => validateIsEmptyObject([1])
		expect(result2).not.toThrow(Error)
	})
})
