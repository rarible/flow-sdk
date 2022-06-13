import { createTestAuth, FLOW_TESTNET_ACCOUNT_3, FLOW_TESTNET_ACCOUNT_4 } from "@rarible/flow-test-common"
import fcl from "@onflow/fcl"
import type { FlowSdk } from "../../../index"
import { createFlowSdk } from "../../../index"

export function createFlowTestTestnetSdk(): { sdk: FlowSdk, address: string }[] {
	const { address, privKey } = FLOW_TESTNET_ACCOUNT_3
	const auth = createTestAuth(fcl, "testnet", address, privKey, 0)
	const sdk = createFlowSdk(fcl, "dev-testnet", {}, auth)
	const { address: address2, privKey: privKey2 } = FLOW_TESTNET_ACCOUNT_4
	const auth2 = createTestAuth(fcl, "testnet", address2, privKey2, 0)
	const sdk2 = createFlowSdk(fcl, "dev-testnet", {}, auth2)
	return [{ sdk, address }, { sdk: sdk2, address: address2 }]
}
