import type { NonFungibleContract } from "../types"
import { NON_FUNGIBLE_CONTRACTS } from "../types"
import type { FlowContractAddress } from "../contract-address"

/** string like a:
 *
 * A.<FlowAddress>.<ContractName>[:<CollectionId>]
 *
 * * ContractName - usually one of NFT contract name
 * * CollectionId ia optional
 *
 * __________________________
 * Examples:
 *
 * A.0x1234567890abcdef.RaribleNFT
 *
 * or with id:
 * A.0x1234567890abcdef.RaribleNFT:12345
 *
 * __________________________
 * To validate your collection id string and type casting use toFlowCollectionId function
 */
export type FlowCollectionId = FlowContractAddress & {
	__IS_FLOW_COLLECTION_ID__: true
}

const collectionIdRegExp = /^A\.0*x*[0-9a-f]{16}\.[0-9A-Za-z_]{3,}(:[0-9]+)?$/

export function isFlowCollectionId(x: string): x is FlowCollectionId {
	return collectionIdRegExp.test(x)
}

export function toFlowCollectionId(str: string): FlowCollectionId {
	if (isFlowCollectionId(str)) {
		return str
	}
	throw new Error("Not an Flow's collection id")
}

/**
 * FlowCollectionName - must be one of NonFungibleContract name
 *
 * __________________________
 * To validate your collection name string and cast it to FlowCollectionName type - use toFlowCollectionName function
 */
export type FlowCollectionName = NonFungibleContract & {
	__IS_FLOW_COLLECTION_NAME__: true
}

export function isFlowCollectionName(x: string): x is FlowCollectionName {
	return NON_FUNGIBLE_CONTRACTS.indexOf(x as NonFungibleContract) >= 0
}

export function toFlowCollectionName(str: string): FlowCollectionName {
	if (isFlowCollectionName(str)) {
		return str
	}
	throw new Error("Not an Flow's collection name")
}
