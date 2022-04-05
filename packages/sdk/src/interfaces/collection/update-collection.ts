import type { Fcl } from "@rarible/fcl-types"
import type { Maybe } from "@rarible/types/build/maybe"
import type { AuthWithPrivateKey, FlowFee, FlowNetwork, FlowTransaction } from "../../types"
import { runTransaction, waitForSeal } from "../../common/transaction"
import { getNftCode } from "../../blockchain-api/nft"
import { getCollectionConfig, getContractAddress } from "../../config/utils"
import type { FlowCollectionId } from "../../types/collection"
import { toFlowCollectionId } from "../../types/collection"


export type UpdateCollectionRequest = {
	collectionId: FlowCollectionId
	icon?: string
	description?: string
	url?: string
	royalties?: FlowFee[]
}

export type UpdateCollectionResponse = FlowTransaction & {
	collectionId: FlowCollectionId
	parentId: FlowCollectionId | null
}

export async function updateCollection(
	fcl: Maybe<Fcl>,
	auth: AuthWithPrivateKey,
	network: FlowNetwork,
	request: UpdateCollectionRequest,
): Promise<UpdateCollectionResponse> {
	if (fcl) {
		const { icon, description, url, collectionId, royalties } = request
		const { name, map, address, userCollectionId } = getCollectionConfig(network, collectionId)
		if (userCollectionId === undefined) {
			throw new Error("Collection id number is not  defined")
		}
		if (name === "SoftCollection") {
			const txId = await runTransaction(
				fcl,
				map,
				getNftCode(name).updateCollection({
					fcl,
					address,
					collectionIdNumber: parseInt(userCollectionId),
					icon,
					description,
					url,
					royalties,
				}),
				auth,
			)
			const txResult = await waitForSeal(fcl, txId)
			if (txResult.events.length) {
				const mintEvent = txResult.events.find(e => e.type.split(".")[3] === "Changed")
				if (mintEvent) {
					const { id, parentId } = mintEvent.data
					const softCollection = getContractAddress(network, "SoftCollection")
					return {
						...txResult,
						collectionId: toFlowCollectionId(`${softCollection}.${id}`),
						parentId: typeof parentId === "number" ? toFlowCollectionId(`${softCollection}.${parentId}`) : null,
					}
				}
				throw new Error("Update event not found in transaction response")
			}
		}
		throw new Error(`Not a  Flow softCollection contract: ${name}`)
	}
	throw new Error("Fcl is required for creation collection")
}
