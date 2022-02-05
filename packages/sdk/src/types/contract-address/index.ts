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
