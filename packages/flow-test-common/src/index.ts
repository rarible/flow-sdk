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

type TestAccount = {
	address: string
	privKey: string
	pubKey: string
}

export const TEST_ACCOUNT_1: TestAccount = {
	address: "0x285b7909b8ed1652",
	privKey: "90a0c5a6cf05794f2e1104ca4be77895d8bfd8d4681eba3552ac5723f585b91c",
	pubKey: "12955691c2f82ebcda217af08f4619a96eb5991b95ac7c9c846e854f2164bc1048ed7f0ed5daa97ea37a638ea9d97b3e6981cd189d4a927a0244258e937d0fc4",
}

export const TEST_ACCOUNT_2: TestAccount = {
	address: "0x2bb384fe0d14e574",
	privKey: "319e778494e038707b4e1ed67b1fdd5a4b36a8ed42f8ef53364c6dc4b1fccdf2",
	pubKey: "4d66ade3ce849e31308221f831c9afc4ec1808cf7ab85b75bb181a04897a8b39447d9cc8be85242385ddd9b580f93f248fa75cfadc9a492dac5b8cbaf149b9a1",
}
