import path from "path"
import { emulator, init } from "flow-js-testing"
import { config } from "@onflow/config"
import { deployAll } from "./deploy-contracts"

type CreateFlowEmulatorParams = {
	logs?: boolean
}


export function createFlowEmulator(params: CreateFlowEmulatorParams): void {
	beforeAll(async () => {
		await startEmulator(params)
		await deployAll(withPrefix(await config().get("SERVICE_ADDRESS")))
	}, 50000)

	afterAll(async () => {
		await emulator.stop()
	}, 40000)

}

export function withPrefix(address: string): string {
	return "0x" + sansPrefix(address)
}

export function sansPrefix(address: string): string {
	return address
		.replace(/^0x/, "")
		.replace(/^Fx/, "")
}

export async function startEmulator(params: CreateFlowEmulatorParams): Promise<void> {
	const basePath = path.resolve(__dirname, "../../cadence")
	await init(basePath)
	await emulator.start()
	if (params.logs) {
		emulator.setLogging(true)
	}
}
