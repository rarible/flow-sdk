import { toFlowContractAddress } from "@rarible/types"
import { getCollectionData, isFlowCollection } from "."

describe("collection", () => {
	test("must validate collection address", () => {
		expect(isFlowCollection(toFlowContractAddress("A.0x01658d9b94068f3c.TopShot"))).toEqual(true)
	})

	test("must return valid collection data", () => {
		expect(getCollectionData(toFlowContractAddress("A.0x01658d9b94068f3c.TopShot"))).toStrictEqual({
			name: "TopShot",
			address: "0x01658d9b94068f3c",
		})
	})

	test("must throw error if unknown collection", () => {
		const assertion = () => getCollectionData(toFlowContractAddress("A.0x01658d9b94068f3c.Top1Shot"))
		expect(assertion).toThrow(Error)
	})
})
