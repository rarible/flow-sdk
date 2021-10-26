export function afterTestWait() {
	afterAll(async () => {
		await new Promise((resolve) => {
			setTimeout(() => {
				resolve("")
			}, 4000)
		})
	})
}
