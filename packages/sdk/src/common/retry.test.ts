import { delay, retry } from "./retry"

describe("retry test", () => {
	test("delay: should wait defined time", async () => {
		const date1 = new Date().getTime()
		await delay(300)
		const date2 = new Date().getTime()
		expect(date2 - date1).toBeGreaterThan(299)
	})

	test("retry: should retry promise", async () => {
		const result = await retry(10, 100, () => new Promise((resolve) => resolve("Test")))
		expect(result).toEqual("Test")
		expect.assertions(2)
		const result2 = () => retry(10, 100, () => new Promise((_, rej) => rej("rejects")))
		await expect(result2()).rejects.toEqual("rejects")
	})
})
