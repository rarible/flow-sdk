import { StorefrontTopShot } from "@rarible/flow-sdk-scripts"
import { CONFIGS } from "../config"
import { replaceImportAddresses } from "./replace-imports"

describe("replace import", () => {
	test("test-emulator replace import", () => {
		const replaceResult = replaceImportAddresses(
			`
			import Contract1Name from "0x0"
			import Contract2Name from "0x0"
			some other code
			`,
			{
				Contract1Name: "0x01",
				Contract2Name: "0x01",
			}
		)
		expect(replaceResult).toBe(`
			import Contract1Name from 0x01
			import Contract2Name from 0x01
			some other code
			`)
	})
	test("should add topShot fee mainnet", () => {
		const result1 = replaceImportAddresses(StorefrontTopShot.sell_flow, CONFIGS.mainnet.mainAddressMap)
		expect(result1.search(/PaymentPart\(address: 0xbd69b6abdfcf4539/)).toBeGreaterThan(0)
		const result2 = replaceImportAddresses(StorefrontTopShot.sell_fusd, CONFIGS.mainnet.mainAddressMap)
		expect(result2.search(/PaymentPart\(address: 0xbd69b6abdfcf4539/)).toBeGreaterThan(0)
		const result3 = replaceImportAddresses(StorefrontTopShot.update_flow, CONFIGS.mainnet.mainAddressMap)
		expect(result3.search(/PaymentPart\(address: 0xbd69b6abdfcf4539/)).toBeGreaterThan(0)
		const result4 = replaceImportAddresses(StorefrontTopShot.update_fusd, CONFIGS.mainnet.mainAddressMap)
		expect(result4.search(/PaymentPart\(address: 0xbd69b6abdfcf4539/)).toBeGreaterThan(0)
	})

	test("should add topShot fee testnet", () => {
		const result1 = replaceImportAddresses(StorefrontTopShot.sell_flow, CONFIGS.testnet.mainAddressMap)
		expect(result1.search(/PaymentPart\(address: 0xebf4ae01d1284af8/)).toBeGreaterThan(0)
		const result2 = replaceImportAddresses(StorefrontTopShot.sell_fusd, CONFIGS.testnet.mainAddressMap)
		expect(result2.search(/PaymentPart\(address: 0xebf4ae01d1284af8/)).toBeGreaterThan(0)
		const result3 = replaceImportAddresses(StorefrontTopShot.update_flow, CONFIGS.testnet.mainAddressMap)
		expect(result3.search(/PaymentPart\(address: 0xebf4ae01d1284af8/)).toBeGreaterThan(0)
		const result4 = replaceImportAddresses(StorefrontTopShot.update_fusd, CONFIGS.testnet.mainAddressMap)
		expect(result4.search(/PaymentPart\(address: 0xebf4ae01d1284af8/)).toBeGreaterThan(0)
	})
})
