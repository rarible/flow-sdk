import type { FlowAddress } from "@rarible/types"
import { toFlowAddress } from "@rarible/types"
import type { FlowContractName } from "../index"

export type FlowContractAddress = string & {
	__IS_FLOW_CONTRACT_ADDRESS__: true
}

export const flowContractRegExp = /^A\.0*x*[0-9a-f]{16}\.[0-9A-Za-z_]{3,}/

export function toFlowContractAddress(str: string): FlowContractAddress {
	if (isFlowContractAddress(str)) {
		return str
	}
	throw new Error("Not an Flow's contract address")
}

export function isFlowContractAddress(x: string): x is FlowContractAddress {
	return flowContractRegExp.test(x)
}

export type FlowContractAddressData = {
	address: FlowAddress
	name: FlowContractName
}

export function parseContractAddress(x: FlowContractAddress): FlowContractAddressData {
	const [, address, name] = x.split(".")
	if (!address || !name) {
		throw new Error("Invalid contract address")
	}
	return {
		address: toFlowAddress(address),
		name: name as FlowContractName,
	}
}
