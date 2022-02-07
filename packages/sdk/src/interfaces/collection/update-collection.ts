import type { Fcl } from "@rarible/fcl-types"
import type { Maybe } from "@rarible/types/build/maybe"
import type { AuthWithPrivateKey, FlowNetwork, FlowTransaction } from "../../types/types"
import { runTransaction, waitForSeal } from "../../common/transaction"
import { getNftCode } from "../../blockchain-api/nft"
import type { FlowContractAddress } from "../../types/contract-address"
import { getCollectionConfig } from "../../config/utils"


export type UpdateCollectionRequest = {
	collection: FlowContractAddress
	icon?: string
	description?: string
	url?: string
}

export type UpdateCollectionResponse = FlowTransaction & {
	collectionId: number
	parentId: number
}

export async function updateCollection(
	fcl: Maybe<Fcl>,
	auth: AuthWithPrivateKey,
	network: FlowNetwork,
	request: UpdateCollectionRequest,
): Promise<UpdateCollectionResponse> {
	if (fcl) {
		const { icon, description, url, collection } = request
		const { name, map, userCollectionId } = getCollectionConfig(network, collection)
		if (!userCollectionId) {
			throw new Error("Collection id number is not defined")
		}
		if (name === "SoftCollection") {
			const txId = await runTransaction(
				fcl,
				map,
				getNftCode(name).updateCollection({
					fcl,
					collectionIdNumber: parseInt(userCollectionId),
					icon,
					description,
					url,
				}),
				auth,
			)
			const txResult = await waitForSeal(fcl, txId)
			if (txResult.events.length) {
				const mintEvent = txResult.events.find(e => e.type.split(".")[3] === "Changed")
				if (mintEvent) {
					return {
						...txResult,
						collectionId: mintEvent.data.id,
						parentId: mintEvent.data.parentId,
					}
				}
				throw new Error("Update event not found in transaction response")
			}
		}
		throw new Error(`Not a  Flow softCollection contract: ${name}`)
	}
	throw new Error("Fcl is required for creation collection")
}
