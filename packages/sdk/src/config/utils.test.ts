import { toFlowContractAddress } from "../types/contract-address"
import { isFlowAddress } from "../types/flow-address"
import { NON_FUNGIBLE_CONTRACTS } from "../types/types"
import { toFlowCollectionId } from "../types/collection"
import { getCollectionConfig, getCollectionData } from "./utils"

describe("getCollectionConfig function", () => {
	test("getCollectionData: must return valid collection data", () => {
		expect(getCollectionData(toFlowCollectionId("A.0x01658d9b94068f3c.TopShot"))).toStrictEqual({
			name: "TopShot",
			address: "0x01658d9b94068f3c",
			contractAddress: "A.0x01658d9b94068f3c.TopShot",
			softCollectionIdFull: "A.0x01658d9b94068f3c.TopShot",
			"softCollectionIdNumber": undefined,
		})
	})

	test("getCollectionData: must return valid collection data", () => {
		expect(getCollectionData(toFlowCollectionId("A.0x01658d9b94068f3c.TopShot:123"))).toStrictEqual({
			name: "TopShot",
			address: "0x01658d9b94068f3c",
			contractAddress: "A.0x01658d9b94068f3c.TopShot",
			softCollectionIdFull: "A.0x01658d9b94068f3c.TopShot:123",
			"softCollectionIdNumber": "123",
		})
	})

	test("getCollectionData: must throw error if unknown collection", () => {
		expect(() => getCollectionData(toFlowCollectionId("A.0x01658d9b94068f3c.Top1Shot"))).toThrow(Error)
	})

	test("getCollectionData: should check collection data ", () => {
		NON_FUNGIBLE_CONTRACTS.forEach(c => {
			const { name } = getCollectionData(toFlowCollectionId(`A.0x01658d9b94068f3c.${c}`))
			expect(name).toEqual(c)
		})
	})
	test("getCollectionConfig: should parse collection id", () => {
		const { address, name, userCollectionId, features } =
			getCollectionConfig("emulator", toFlowContractAddress("A.0x1234567890abcdef.StarlyCard:12345"))
		expect(isFlowAddress(address)).toBeTruthy()
		expect(NON_FUNGIBLE_CONTRACTS.includes(name)).toBeTruthy()
		expect(userCollectionId).toEqual("12345")
		expect(features).toStrictEqual(["TRANSFER", "BURN"])
	})
})
