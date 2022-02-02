import type { FlowAddress } from "@rarible/types"
import { toFlowAddress } from "@rarible/types"
import type { NonFungibleContract } from "../../types"
import { NON_FUNGIBLE_CONTRACTS } from "../../types"

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

export const flowAddressRegExp = /^0*x*[0-9a-f]{16}/

export function isFlowAddress(x: string): x is FlowAddress {
	return flowAddressRegExp.test(x)
}

export type FlowContractAddressName = string & {
	__IS_FLOW_CONTRACT_NAME__: true
}

type FlowContractAddressData = {
	address: FlowAddress
	name: NonFungibleContract
	softCollectionId: string | undefined
}

export function parseContractAddress(x: FlowContractAddress): FlowContractAddressData {
	const [, address, name, softCollectionId] = x.split(".")
	if (!address || !name) {
		throw new Error("Invalid contract address")
	} else if (NON_FUNGIBLE_CONTRACTS.indexOf(name as NonFungibleContract) === -1) {
		throw new Error(`Unknown or not a non-fungible contract name: ${name}`)
	}
	return {
		address: toFlowAddress(address),
		name: name as NonFungibleContract,
		softCollectionId,
	}
}
