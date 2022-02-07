import type { FlowAddress } from "@rarible/types"

export const flowAddressRegExp = /^0*x*[0-9a-f]{16}/

export function isFlowAddress(x: string): x is FlowAddress {
	return flowAddressRegExp.test(x)
}
