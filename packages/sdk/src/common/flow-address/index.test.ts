import { toFlowAddress } from "@rarible/types"
import { parseContractAddress, toFlowContractAddress } from "."

describe("ethereum/utils/to-flow-address", () => {
	it("should correctly parse flow address", () => {
		expect(toFlowAddress("0x55ad22f01ef568a1")).toStrictEqual("0x55ad22f01ef568a1")
	})

	it("should invalidate wrong flow address", () => {
		expect(() => toFlowAddress("0xД5ad22f01ef568a1")).toThrow()
	})

	it("correctly parse contract address", () => {
		expect(toFlowContractAddress("A.0x665b9acf64dfdfdb.CommonNFT")).toStrictEqual("A.0x665b9acf64dfdfdb.CommonNFT")
	})

	it("correctly parse contract address with underscore", () => {
		expect(toFlowContractAddress("A.0x665b9acf64dfdfdb.CommonNFT_TEST")).toStrictEqual(
			"A.0x665b9acf64dfdfdb.CommonNFT_TEST"
		)
	})

	it("should correctly parse contract address", () => {
		expect(parseContractAddress(toFlowContractAddress("A.0x665b9acf64dfdfdb.CommonNFT"))).toStrictEqual({
			address: "0x665b9acf64dfdfdb",
			name: "CommonNFT",
		})
	})

	it("should correctly parse contract address with underscore", () => {
		expect(parseContractAddress(toFlowContractAddress("A.0x665b9acf64dfdfdb.CommonNFT_TEST"))).toStrictEqual({
			address: "0x665b9acf64dfdfdb",
			name: "CommonNFT_TEST",
		})
	})
})
