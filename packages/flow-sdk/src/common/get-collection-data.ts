import { CollectionName, FlowAddress } from "../types"

type CollectionData = {
	name: CollectionName,
	address: FlowAddress
}

export function getCollectionData(collection: string): CollectionData {
	const [_, address, name] = collection.split(".")
	if (!_ || !address || !name) {
		throw Error("SDK error, unable to parse collection string")
	}
	switch (name) {
		case "RaribleNFT": {
			return { name: "RaribleNFT", address }
		}
		case "MotoGPCard": {
			return { name: "MotoGPCard", address }
		}
		case "Evolution": {
			return { name: "Evolution", address }
		}
		case "TopShot": {
			return { name: "TopShot", address }
		}
		default: {
			throw Error("SDK error, unable to parse collection string")
		}
	}
}
