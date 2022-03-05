import { getErrorMessage } from "./errors"

describe("Error parser test", () => {
	test("Should parse and replace error message", () => {
		const message = `Error: execution error code 1101: [Error Code: 1101] cadence runtime error Execution failed:
error: pre-condition failed: AU27: too short duration
   --> f8d6e0586b0a20c7.EnglishAuction:227:16
    |
227 |                 duration >= EnglishAuction.minimalDuration : "AU27: too short duration"
    |                 ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
`
		const result = getErrorMessage(message, "englishAuction")
		expect(result).toEqual("too short duration")
	})
})
