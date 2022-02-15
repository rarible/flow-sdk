import { isFlowCollectionId, toFlowCollectionId } from "./index"

describe("collection", () => {
	test("isFlowCollectionId: must validate collection address", () => {
		expect(isFlowCollectionId("A.0x01658d9b94068f3c.TopShot")).toEqual(true)
	})

	test("isFlowCollectionId: must validate collection address", () => {
		expect(isFlowCollectionId("A.0x01658d9b94068f3c.TopShot:123")).toEqual(true)
		expect(toFlowCollectionId("A.0x01658d9b94068f3c.TopShot:123"))
			.toEqual("A.0x01658d9b94068f3c.TopShot:123")
	})

	test("isFlowCollectionId: must validate invalid collection address", () => {
		expect(isFlowCollectionId("A.0x01658d9b94068f3c.TopShot:ABC")).toEqual(false)
	})

	test("isFlowCollectionId: must validate invalid collection address", () => {
		expect(isFlowCollectionId("A.0x01658d9b94068f3.TopShot")).toEqual(false)
	})

	test("isFlowCollectionId: must validate invalid collection address", () => {
		expect(isFlowCollectionId("A.0x01658d9b94068f3c.TopShot.123")).toEqual(false)
		expect(() => toFlowCollectionId("A.0x01658d9b94068f3c.TopShot.123")).toThrowError()
	})
})
