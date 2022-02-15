import type { FclArgs } from "@rarible/fcl-types"

export type PreparedTransactionParamsResponse = {
	cadence: string
	args?: ReturnType<FclArgs>
}
