import type { FlowAddress, FlowContractAddress } from "@rarible/types"
import type { FlowConfigData } from "../../config"
import { CONFIGS, flowCollectionsConfig } from "../../config"
import type { FlowNetwork } from "../../types"
import type { FlowCollectionName } from "./index"
import { getCollectionData } from "./index"

export type CollectionConfig = {
	map: Record<string, FlowAddress>
	address: FlowAddress
	config: FlowConfigData
	name: FlowCollectionName
}

export function getCollectionConfig(network: FlowNetwork, collection: FlowContractAddress): CollectionConfig {
	const { name, address } = getCollectionData(collection)
	const map: Record<string, FlowAddress> = {}
	const config = flowCollectionsConfig[name]
	config.contractsNames.forEach(k => {
		map[k] = address
	})
	return {
		map: Object.assign(map, CONFIGS[network].mainAddressMap),
		address,
		name,
		config,
	}
}
