import { createTestAuth, FLOW_TESTNET_ACCOUNT_3, FLOW_TESTNET_ACCOUNT_4 } from "@rarible/flow-test-common"
import fcl from "@onflow/fcl"
import type { FlowEnv, FlowSdk } from "../../../index"
import { createFlowSdk } from "../../../index"

export function createFlowTestTestnetSdk(env: FlowEnv = "dev-testnet"): { sdk: FlowSdk, address: string }[] {
	const { address, privKey } = FLOW_TESTNET_ACCOUNT_3
	const auth = createTestAuth(fcl, "testnet", address, privKey, 0)
	const sdk = createFlowSdk(fcl, env, {}, auth)
	const { address: address2, privKey: privKey2 } = FLOW_TESTNET_ACCOUNT_4
	const auth2 = createTestAuth(fcl, "testnet", address2, privKey2, 0)
	const sdk2 = createFlowSdk(fcl, env, {}, auth2)
	return [{ sdk, address }, { sdk: sdk2, address: address2 }]
}
