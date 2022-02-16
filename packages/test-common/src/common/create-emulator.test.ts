import { emulator } from "flow-js-testing"
import { startEmulator } from "./create-emulator"

describe("test emulator", () => {
	test.skip("should start and stop emulator", async () => {

		await startEmulator({ logs: true })
		expect(emulator.logging).toBeTruthy()
		expect("process" in emulator).toBeTruthy()
		expect(emulator.process.pid).toBeTruthy()
		expect(emulator.process.killed).toBeFalsy()

		await emulator.stop()
		expect(emulator.process.killed).toBeTruthy()
	})
})
