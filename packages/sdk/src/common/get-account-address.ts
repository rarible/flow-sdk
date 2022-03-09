import type { FlowAddress } from "@rarible/types"
import { toFlowAddress } from "@rarible/types"
import type { Fcl } from "@rarible/fcl-types"
import type { AuthWithPrivateKey } from "../types"

export async function getAccountAddress(fcl: Fcl, auth?: AuthWithPrivateKey): Promise<FlowAddress> {
	const from = auth ? toFlowAddress((await auth()).addr) : toFlowAddress((await fcl.currentUser().snapshot()).addr!)
	if (from) {
		return from
	}
	throw new Error("FLOW-SDK: Can't get current user address")
}
