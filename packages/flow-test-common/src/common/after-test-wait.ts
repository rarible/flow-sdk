export function afterTestWait() {
	afterAll(async () => {
		await new Promise((r) => setTimeout(r, 1500))
	})
}
