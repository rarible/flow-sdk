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
	address: "0x285b7909b8ed1652",
	privKey: "90a0c5a6cf05794f2e1104ca4be77895d8bfd8d4681eba3552ac5723f585b91c",
	pubKey: "12955691c2f82ebcda217af08f4619a96eb5991b95ac7c9c846e854f2164bc1048ed7f0ed5daa97ea37a638ea9d97b3e6981cd189d4a927a0244258e937d0fc4",

}
