import type { FlowAddress, FlowContractAddress } from "@rarible/types"
import type { FlowConfigData } from "../../config/config"
import { CONFIGS, flowCollectionsConfig } from "../../config/config"
import type { FlowNetwork, NonFungibleContract } from "../../types"
import { getCollectionData } from "./index"

export type CollectionConfig = {
	map: Record<string, FlowAddress>
	address: FlowAddress
	config: FlowConfigData
	name: NonFungibleContract
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
