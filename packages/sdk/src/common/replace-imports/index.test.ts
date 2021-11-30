import { replaceImportAddresses } from "."

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
			},
		)
		expect(replaceResult).toBe(`
			import Contract1Name from 0x01
			import Contract2Name from 0x01
			some other code
			`)
	})
})
