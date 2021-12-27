const decimalRegexp = /^\d+\.\d+$/
const zeroDecimalRegexp = /^0+\.0+$/
const numberRegExp = /^\d+$/
const zeroNumberRegExp = /^0+$/

export function validateNumber(v: string): void {
	if (v) {
		if (!numberRegExp.test(v)) {
			throw new Error("Value should have only digits")
		}
		if (zeroNumberRegExp.test(v)) {
			throw new Error("Value should be greater then zero")
		}
	} else {
		throw new Error("Value should not be empty")
	}
}

export function validateDecimalNumber(v: string): void {
	if (v) {
		if (!decimalRegexp.test(v)) {
			throw new Error("Value should have only digits")
		}
		if (zeroDecimalRegexp.test(v)) {
			throw new Error("Value should be greater then zero")
		}
	} else {
		throw new Error("Value should not be empty")
	}
}

export function validateIsEmptyString(v: string): void {
	if (!v) throw new Error("Value should not be empty")
}

export function validateIsEmptyObject(v: [] | {}): void {
	if ("length" in v) {
		if (!v.length) {
			throw new Error("Array is empty")
		}
	} else if (!Object.keys(v).length) {
		throw new Error("Object is empty")
	}
}
