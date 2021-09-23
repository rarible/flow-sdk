import path from "path"
import { emulator, getAccountAddress, init, mintFlow } from "flow-js-testing"
import { deployAll } from "./deploy-contracts"

type CreateFlowEmulatorParams = {
	logs?: boolean
}

type CreateFlowEmulator = {
	accountName: string
}

export function createFlowEmulator(params: CreateFlowEmulatorParams): CreateFlowEmulator {
	const accountName: string = "Bob"
	beforeAll(async () => {
		const basePath = path.resolve(__dirname, "../cadence")
		await init(basePath)
		await emulator.start()
		if (params.logs) {
			emulator.setLogging(true)
		}
		const account = await getAccountAddress(accountName)
		await mintFlow(account, "0.1")
		await deployAll(account)
	})
	afterAll(async () => {
		await emulator.stop()
	})

	return { accountName }
}
