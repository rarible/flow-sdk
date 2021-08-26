import * as path from "path"
import { getAccountAddress, init } from "flow-js-testing"

const basePath = path.resolve(__dirname, "../cadence")
console.log(__dirname)
console.log(basePath)

beforeAll(() => {
	init(basePath)
})

describe("Accounts", () => {
	test("Create Accounts", async () => {
		const Alice = await getAccountAddress("Alice")
		const Bob = await getAccountAddress("Bob")
		const Charlie = await getAccountAddress("Charlie")
		const Dave = await getAccountAddress("Dave")

		console.log("Four accounts were created with following addresses:\n", {
			Alice,
			Bob,
			Charlie,
			Dave,
		})
	})
})
