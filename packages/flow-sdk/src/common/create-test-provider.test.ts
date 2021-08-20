import { getContractAddress, init } from "flow-js-testing"

const path = require("path")

const basePath = path.resolve(__dirname, "../cadence")

beforeAll(() => {
	init(basePath)
})

describe("Accounts", () => {
	test("Create Accounts", async () => {
		const contract = await getContractAddress("CommonFee")
		console.log({ contract })
	})
})
