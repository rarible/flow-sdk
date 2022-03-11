import {
	createEmulatorAccount,
	createTestAuth,
	FLOW_TESTNET_ACCOUNT_3,
	FLOW_TESTNET_ACCOUNT_4,
} from "@rarible/flow-test-common"
import fcl from "@onflow/fcl"
import type { FlowAddress } from "@rarible/types"
import { toFlowAddress } from "@rarible/types"
import type { Fcl } from "@rarible/fcl-types"
import type { FlowEnv, FlowSdk } from "../index"
import { createFlowSdk } from "../index"

export async function createFlowTestEmulatorSdk(accountName: string)
	: Promise<{ sdk: FlowSdk, address: FlowAddress, pk: string }> {

	const { address, pk } = await createEmulatorAccount(accountName)
	const auth = createTestAuth(fcl, "emulator", address, pk, 0)
	const sdk = createFlowSdk(fcl, "emulator", {}, auth)
	return { sdk, address: toFlowAddress(address), pk }
}

type TestnetTestSdk = { sdk: FlowSdk, address: FlowAddress }

export function createFlowTestTestnetSdk(fcl: Fcl, env: FlowEnv)
	: TestnetTestSdk[] {
	const testnetAuth1 = createTestAuth(fcl, "testnet", FLOW_TESTNET_ACCOUNT_3.address, FLOW_TESTNET_ACCOUNT_3.privKey)
	const testnetSdk1 = createFlowSdk(fcl, env, {}, testnetAuth1)
	const testnetAuth2 = createTestAuth(fcl, "testnet", FLOW_TESTNET_ACCOUNT_4.address, FLOW_TESTNET_ACCOUNT_4.privKey)
	const testnetSdk2 = createFlowSdk(fcl, env, {}, testnetAuth2)

	return [
		{ sdk: testnetSdk1, address: toFlowAddress(FLOW_TESTNET_ACCOUNT_3.address) },
		{ sdk: testnetSdk2, address: toFlowAddress(FLOW_TESTNET_ACCOUNT_4.address) },
	]
}
