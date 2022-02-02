import type { FlowAddress } from "@rarible/types"
import type { FlowConfigData } from "../../config/config"
import { CONFIGS, flowCollectionsConfig } from "../../config/config"
import type { FlowNetwork, NonFungibleContract } from "../../types"
import type { FlowContractAddress } from "../flow-address"
import { getCollectionData } from "./index"

export type CollectionConfig = {
	map: Record<string, FlowAddress>
	address: FlowAddress
	features: FlowConfigData["features"]
	name: NonFungibleContract
	isUserCollection: boolean
	userCollectionId?: string
}

export function getCollectionConfig(network: FlowNetwork, collection: FlowContractAddress): CollectionConfig {
	const { name, address, softCollectionId } = getCollectionData(collection)
	const isUserCollection = !!softCollectionId
	return {
		map: CONFIGS[network].mainAddressMap,
		address,
		name,
		features: flowCollectionsConfig[name].features,
		isUserCollection,
		...isUserCollection ? { userCollectionId: softCollectionId } : {},
	}
}
