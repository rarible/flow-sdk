import { Service } from "./test"

describe("test", function() {

	test('flow', async () => {
		const service = new Service()
		const a = await service.getAccount('0xf8d6e0586b0a20c7')
		console.log(a)
		console.log(typeof a)
	})

})
