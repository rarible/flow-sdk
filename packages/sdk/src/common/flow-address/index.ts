import type { FlowAddress, FlowContractAddress } from "@rarible/types"
import { toFlowAddress } from "@rarible/types"
import type { NonFungibleContract } from "../../types"
import { NON_FUNGIBLE_CONTRACTS } from "../../types"

export type FlowContractAddressName = string & {
	__IS_FLOW_CONTRACT_NAME__: true
}

type FlowContractAddressData = {
	address: FlowAddress
	name: NonFungibleContract
}

export function parseContractAddress(x: FlowContractAddress): FlowContractAddressData {
	const [, address, name] = x.split(".")
	if (!address || !name) {
		throw new Error("Invalid contract address")
	} else if (NON_FUNGIBLE_CONTRACTS.indexOf(name as NonFungibleContract) === -1) {
		throw new Error(`Unknown or not a non-fungible contract name: ${name}`)
	}
	return {
		address: toFlowAddress(address),
		name: name as NonFungibleContract,
	}
}
