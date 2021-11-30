import type { FlowAddress, FlowContractAddress } from "@rarible/types"
import { toFlowAddress } from "@rarible/types"

export const flowAddressRegExp = /^0*x*[0-9a-f]{16}/

export function isFlowAddress(x: string): x is FlowAddress {
	return flowAddressRegExp.test(x)
}

export type FlowContractAddressName = string & {
	__IS_FLOW_CONTRACT_NAME__: true
}

type FlowContractAddressData = {
	address: FlowAddress
	name: FlowContractAddressName
}

export function parseContractAddress(x: FlowContractAddress): FlowContractAddressData {
	const [, address, name] = x.split(".")
	if (!address || !name) {
		throw new Error("Invalid contract address")
	}
	return {
		address: toFlowAddress(address),
		name: name as FlowContractAddressName,
	}
}
