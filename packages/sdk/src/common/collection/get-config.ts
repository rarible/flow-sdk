import type { FlowAddress } from "@rarible/types"
import type { FlowConfigData } from "../../config/config"
import { CONFIGS, flowCollectionsConfig } from "../../config/config"
import type { FlowNetwork } from "../../types"
import type { FlowContractAddress } from "../flow-address"
import type { FlowCollectionName } from "./index"
import { getCollectionData } from "./index"

export type CollectionConfig = {
	map: Record<string, FlowAddress>
	address: FlowAddress
	features: FlowConfigData["features"]
	name: FlowCollectionName
}

export function getCollectionConfig(network: FlowNetwork, collection: FlowContractAddress): CollectionConfig {
	const { name, address } = getCollectionData(collection)
	return {
		map: CONFIGS[network].mainAddressMap,
		address,
		name,
		features: flowCollectionsConfig[name].features,
	}
}
