import { createEmulatorAccount, createTestAuth, FLOW_TESTNET_ACCOUNT_3 } from "@rarible/flow-test-common"
import fcl from "@onflow/fcl"
import type { FlowAddress } from "@rarible/types"
import { toFlowAddress } from "@rarible/types"
import type { FlowSdk } from "../index"
import { createFlowSdk } from "../index"

export async function createFlowTestEmulatorSdk(accountName: string)
	: Promise<{ sdk: FlowSdk, address: FlowAddress, pk: string }> {

	const { address, pk } = await createEmulatorAccount(accountName)
	const auth = createTestAuth(fcl, "emulator", address, pk, 0)
	const sdk = createFlowSdk(fcl, "emulator", {}, auth)
	return { sdk, address: toFlowAddress(address), pk }
}

export async function createFlowTestnetSdk(
	address: string = FLOW_TESTNET_ACCOUNT_3.address, pk: string = FLOW_TESTNET_ACCOUNT_3.privKey,
): Promise<{ sdk: FlowSdk, address: FlowAddress, pk: string }> {
	const auth = createTestAuth(fcl, "testnet", address, pk)
	const sdk = createFlowSdk(fcl, "dev", {}, auth)
	return { sdk, address: toFlowAddress(address), pk }
}
