import { fillCodeTemplate, replaceImportAddresses } from "."

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
	test("replace by map", () => {
		const fillResult = fillCodeTemplate(
			"@s @n @t @w @v, @s @n @t @w @v",
			{
				"@s": "some",
				"@n": "new",
				"@t": "template",
				"@w": "with",
				"@v": "variables",
			},
		)
		expect(fillResult).toEqual("some new template with variables, some new template with variables")
	})
})
