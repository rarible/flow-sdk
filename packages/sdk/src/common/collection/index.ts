import type { FlowAddress } from "@rarible/types"
import type { FlowContractAddress, FlowContractAddressName } from "../flow-address"
import { parseContractAddress } from "../flow-address"
import type { NonFungibleContract } from "../../types"
import { NON_FUNGIBLE_CONTRACTS } from "../../types"

export type FlowCollectionName = FlowContractAddressName & {
	__IS_FLOW_COLLECTION_NAME__: true
}

export type FlowCollectionAddress = FlowContractAddress & {
	__IS_FLOW_KNOWN_COLLECTION_ADDRESS__: true
}

//todo remove this function
export function isFlowCollection(address: FlowContractAddress): address is FlowCollectionAddress {
	const { name } = parseContractAddress(address)
	return NON_FUNGIBLE_CONTRACTS.indexOf(name) !== -1
}

export type FlowCollectionData = {
	name: NonFungibleContract
	address: FlowAddress
	softCollectionId: string | undefined
}

export function getCollectionData(str: FlowContractAddress): FlowCollectionData {
	if (isFlowCollection(str)) {
		return parseContractAddress(str)
	}
	throw new Error("Not a known collection address")
}
