import type { Fcl } from "@rarible/fcl-types"
import type { Maybe } from "@rarible/types/build/maybe"
import type { FlowAddress } from "@rarible/types"
import type { AuthWithPrivateKey } from "../../types"
import { getAccountAddress } from "../../common/get-account-address"

export async function getFrom(
	fcl: Maybe<Fcl>,
	auth?: AuthWithPrivateKey,
): Promise<FlowAddress> {
	if (fcl) {
		return getAccountAddress(fcl, auth)
	}
	throw new Error("Fcl is required for balance request")
}
