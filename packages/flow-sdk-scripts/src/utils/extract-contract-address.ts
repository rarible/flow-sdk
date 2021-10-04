// expected collection pattern: A.{contractAddress}.{contractName}

import { Collection, FlowAddress } from "../types/types"

export function extractContractAddress(collection: Collection): FlowAddress {
	return collection.split(".")[1]
}
