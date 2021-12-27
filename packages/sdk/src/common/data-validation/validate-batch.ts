import { validateDecimalNumber, validateIsEmptyObject, validateIsEmptyString, validateNumber } from "./data-validators"

export const validateBatch = {
	number: (...args: string[]) => args.forEach(v => validateNumber(v)),
	decimal: (...args: string[]) => args.forEach(v => validateDecimalNumber(v)),
	object: (...args: ([] | {})[]) => args.forEach(v => validateIsEmptyObject(v)),
	string: (...args: string[]) => args.forEach(v => validateIsEmptyString(v)),
}
