import type { NonFungibleContract } from "../types/types"
import { getNftCode } from "./nft"

describe("getNftCode function", () => {
	test("getNftCode: should success get code", () => {
		expect(getNftCode("SoftCollection")).toBeTruthy()
	})
	test("getNftCode: should throw error", () => {
		expect(() => getNftCode("SoftCollectio" as NonFungibleContract)).toThrowError()
	})
})
