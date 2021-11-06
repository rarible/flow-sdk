import { toFlowContractAddress, toFlowAddress } from "."

describe("flow-address", () => {
	test("toFlowContractAddress: should success get collection if address with prefix", () => {
		const test0 = toFlowContractAddress("A.0xabcdef0123456789.ContractName")
		expect(typeof test0).toEqual("string")
	})
	test("toFlowContractAddress: should success get collection if address without prefix", () => {
		const test1 = () => toFlowContractAddress("A.abcdef0123456789.ContractName")
		expect(typeof test1()).toEqual("string")
	})
	test("toFlowContractAddress should throw error, incorrect address length", () => {
		const test3 = () => toFlowContractAddress("A.0xabcdef0123.ContractName")
		expect(test3).toThrow(Error)
	})
	test("toFlowContractAddress should throw error, Invalid contract name length", () => {
		const test5 = () => toFlowContractAddress("A.0xabcdef0123456789.Co")
		expect(test5).toThrow(Error)
	})
	test("toFlowContractAddress should throw error, Without contract name", () => {
		const test6 = () => toFlowContractAddress("A.0xabcdef0123456789")
		expect(test6).toThrow(Error)
	})
	test("toFlowContractAddress should throw error, Without collection 'A' prefix", () => {
		const test7 = () => toFlowContractAddress("0xabcdef0123456789.ContractName")
		expect(test7).toThrow(Error)
	})
	test("toFlowAddress function, should parse address with prefix", () => {
		const test1 = toFlowAddress("0xabcdef0123456789")
		expect(test1?.length).toEqual(18)
	})
	test("toFlowAddress function, should parse address without prefix", () => {
		const test1 = toFlowAddress("abcdef0123456789")
		expect(test1?.length).toEqual(18)
	})
	test("toFlowAddress function, should throw error, Contract address", () => {
		const test1 = () => toFlowAddress("A.abcdef0123456789.ContractName")
		expect(test1).toThrow(Error)
	})
})