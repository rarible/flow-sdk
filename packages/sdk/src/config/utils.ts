import type { FlowAddress } from "@rarible/types"
import { toFlowAddress } from "@rarible/types"
import type { FlowNetwork, NonFungibleContract } from "../types"
import { NON_FUNGIBLE_CONTRACTS } from "../types"
import type { FlowContractAddress } from "../types/contract-address"
import { toFlowContractAddress } from "../types/contract-address"
import { sansPrefix } from "../common/prefix"
import type { FlowCollectionId } from "../types/collection"
import { toFlowCollectionId, toFlowCollectionName } from "../types/collection"
import type { FlowConfigData } from "./config"
import { CONFIGS, flowCollectionsConfig } from "./config"

export function getContractAddress(network: FlowNetwork, collectionName: NonFungibleContract) {
	return toFlowContractAddress(`A.${sansPrefix(CONFIGS[network].mainAddressMap[collectionName])}.${collectionName}`)
}

export type CollectionConfig = {
	map: Record<string, FlowAddress>
	address: FlowAddress
	features: FlowConfigData["features"]
	name: NonFungibleContract
	userCollectionId?: string
}
export type FlowCollectionData = {
	name: NonFungibleContract
	address: FlowAddress
	contractAddress: FlowContractAddress
	softCollectionIdNumber: string | undefined
	softCollectionIdFull: FlowCollectionId
}

/**
 * Parse collection id string and return part of it
 */
export function getCollectionData(x: FlowCollectionId): FlowCollectionData {
	const [prefix, address, name, softCollectionId] = x.split(".")
	const collectionName = toFlowCollectionName(name)
	if (!address || !collectionName) {
		throw new Error("Invalid collection address")
	} else if (NON_FUNGIBLE_CONTRACTS.indexOf(collectionName) === -1) {
		throw new Error(`Unknown or not a non-fungible contract name: ${collectionName}`)
	}
	return {
		address: toFlowAddress(address),
		name: collectionName,
		contractAddress: toFlowContractAddress(`${prefix}.${address}.${name}`),
		softCollectionIdNumber: softCollectionId,
		softCollectionIdFull: x,
	}
}

export function getCollectionConfig(network: FlowNetwork, collection: FlowContractAddress): CollectionConfig {
	const { name, address, softCollectionIdNumber } = getCollectionData(toFlowCollectionId(collection))
	return {
		map: CONFIGS[network].mainAddressMap,
		address,
		name,
		features: flowCollectionsConfig[name].features,
		userCollectionId: softCollectionIdNumber,
	}
}
