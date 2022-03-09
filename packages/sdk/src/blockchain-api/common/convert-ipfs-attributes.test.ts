import { convertIpfsAttributes } from "./convert-ipfs-attributes"

describe("Test convertIpfsAttributes", () => {
	test("should convert attributes from ipfs to cadence args", () => {
		expect(convertIpfsAttributes(validAttributes1).length).toEqual(2)
		expect(() => convertIpfsAttributes(validAttributes2).length).toThrow()
	})
})
const validAttributes1 = [
	{ "key": "name", "trait_type": "name", "value": "bob" },
	{ "key": "age", "trait_type": "age", "value": "18" },
]

const validAttributes2 = [
	{ "key": "name" },
	{ "key": "age" },
]
