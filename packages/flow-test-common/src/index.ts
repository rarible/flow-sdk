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
	fcl.config()
		.put("accessNode.api", "https://access-testnet.onflow.org")
		.put("challenge.handshake", "https://flow-wallet-testnet.blocto.app/authn")
	const flowService = new FlowService(
		fcl,
		accountAddress,
		privateKey,
		keyIndex,
	)
	return flowService.authorizeMinter()
}
