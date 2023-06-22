import {createTestAuth} from "@rarible/flow-test-common"
import type {Fcl} from "@rarible/fcl-types"
import {createFlowSdk} from "../../index"

export function createTestSdk(fcl: Fcl, account: {address: string, privKey: string}) {
	const auth = createTestAuth(
		fcl,
		"testnet",
		account.address,
		account.privKey
	)

	return createFlowSdk(fcl, "testnet", {}, auth)
}
