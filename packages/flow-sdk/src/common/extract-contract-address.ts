// expected collection pattern: A.{contractAddress}.{contractName}

export function extractContractAddress(collection: string): string {
	return collection.split(".")[1]
}
