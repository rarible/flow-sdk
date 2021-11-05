import type { CollectionName, FlowAddress } from "../types"
import type { AddressMap, ConfigData, Networks } from "../config"
import { collectionsConfig, CONFIGS } from "../config"
import { getCollectionData } from "./get-collection-data"

type GetContractsConfig = {
	addressMap: AddressMap,
	collectionAddress: FlowAddress,
	collectionConfig: ConfigData,
	collectionName: CollectionName
}

export function getCollectionConfig(network: Networks, collection: string): GetContractsConfig {
	try {
		const { name, address } = getCollectionData(collection)
		const map: AddressMap = {}
		collectionsConfig[name].contractsNames.forEach(k => {
			map[k] = address
		})
		return {
			addressMap: Object.assign(map, CONFIGS[network].mainAddressMap),
			collectionAddress: address,
			collectionName: name,
			collectionConfig: collectionsConfig[name],
		}
	} catch (e) {
		throw new Error(`Wrong collection: ${e}`)
	}
}
