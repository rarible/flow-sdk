import { parseEvents } from "./parse-tx-events"

describe("parseEvents test", () => {
	test("parseEvents: parse events", async () => {
		expect(
			parseEvents([{ type: "A.123.Contract.Deposit", data: { testField: "123" } }], "Deposit", "testField"),
		).toEqual("123")
	})
	test("parseEvents: throw error event not found", async () => {
		expect(
			() => parseEvents([{ type: "A.123.Contract.Deposi", data: { testField: "123" } }], "Deposit", "testField"),
		).toThrowError("Event Deposit not found in transaction events")
	})

	test("parseEvents: throw error field not found in event data", async () => {
		expect(
			() => parseEvents([{ type: "A.123.Contract.Deposit", data: { testField: "123" } }], "Deposit", "testField1"),
		).toThrowError("Field testField1 not found in event data")
	})
})
