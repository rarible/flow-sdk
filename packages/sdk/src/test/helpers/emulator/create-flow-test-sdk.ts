import { createEmulatorAccount, createTestAuth } from "@rarible/flow-test-common"
import fcl from "@onflow/fcl"
import type { FlowAddress } from "@rarible/types"
import { toFlowAddress } from "@rarible/types"
import type { FlowSdk } from "../../../index"
import { createFlowSdk } from "../../../index"

export async function createFlowTestEmulatorSdk(accountName: string): Promise<{ sdk: FlowSdk, address: FlowAddress }> {
	const { address, pk } = await createEmulatorAccount(accountName)
	const auth = createTestAuth(fcl, "emulator", address, pk, 0)
	const sdk = createFlowSdk(fcl, "emulator", {}, auth)
	return { sdk, address: toFlowAddress(address) }
}
