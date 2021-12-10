import type { FlowAddress } from "@rarible/types"
import type { FlowContractAddress, FlowContractAddressName } from "../flow-address"
import { parseContractAddress } from "../flow-address"

export type FlowCollectionName = FlowContractAddressName & {
	__IS_FLOW_COLLECTION_NAME__: true
}

export const flowCollections = ["MotoGPCard", "Evolution", "TopShot", "RaribleNFT", "MugenNFT"] as FlowContractAddressName[]

export type FlowCollectionAddress = FlowContractAddress & {
	__IS_FLOW_KNOWN_COLLECTION_ADDRESS__: true
}

export function isFlowCollection(address: FlowContractAddress): address is FlowCollectionAddress {
	const { name } = parseContractAddress(address)
	return flowCollections.indexOf(name) !== -1
}

export type FlowCollectionData = {
	name: FlowCollectionName
	address: FlowAddress
}

export function getCollectionData(str: FlowContractAddress): FlowCollectionData {
	if (isFlowCollection(str)) {
		return parseContractAddress(str) as FlowCollectionData
	}
	throw new Error("Not a known collection address")
}
