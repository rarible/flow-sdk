import path from "path"
import { emulator, getAccountAddress, init, mintFlow } from "flow-js-testing"
import { Fcl } from "@rarible/fcl-types"
import { deployAll } from "./common/deploy-contracts"
import { FlowService } from "./common/authorizer"

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

export function createTestAuth(fcl: Fcl, accountAddress: string, privateKey: string, keyIndex: number = 0) {
	const flowService = new FlowService(
		fcl,
		accountAddress,
		privateKey,
		keyIndex,
	)
	return flowService.authorizeMinter()
}

export const testAccount = {
	address: "0xec2a94b19a8931d8",
	privKey: "7b829cbd4d2993bf90c3b9d098488980c67cd5cc31ae3fee8c995465cfd1c16c",
	pubKey: "c7fefd4f5dbbf79e65f3f4bd6b8597ac53b9014449874b918222b206f6634ce7eba1093980ebec11c05afcec1c00b1fa5f97ecdae5b2f1c2590bf58ee3c5c4a1",
}
