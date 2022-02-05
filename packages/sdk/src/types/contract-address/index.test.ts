import { toFlowContractAddress } from "./index"

describe("to-flow-address", () => {

	it("correctly parse contract address", () => {
		expect(toFlowContractAddress("A.0x665b9acf64dfdfdb.CommonNFT")).toStrictEqual("A.0x665b9acf64dfdfdb.CommonNFT")
	})

	it("correctly parse contract address with underscore", () => {
		expect(toFlowContractAddress("A.0x665b9acf64dfdfdb.CommonNFT_TEST")).toStrictEqual(
			"A.0x665b9acf64dfdfdb.CommonNFT_TEST",
		)
	})

	it("correctly parse contract address", () => {
		expect(toFlowContractAddress("A.0x665b9acf64dfdfdb.CommonNFT.ASD")).toStrictEqual(
			"A.0x665b9acf64dfdfdb.CommonNFT.ASD",
		)
	})
})
