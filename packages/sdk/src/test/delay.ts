export async function testDelay(delay: number): Promise<void> {
	await new Promise((resolve) => {
		setTimeout(() => {
			resolve("")
		}, delay)
	})
}
