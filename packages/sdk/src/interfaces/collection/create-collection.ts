import type { Fcl } from "@rarible/fcl-types"
import type { Maybe } from "@rarible/types/build/maybe"
import { toFlowAddress } from "@rarible/types"
import type { AuthWithPrivateKey, FlowFee, FlowNetwork, FlowTransaction } from "../../types"
import { validateRoyalties } from "../nft/common/validate-royalties"
import { runTransaction, waitForSeal } from "../../common/transaction"
import { getNftCode } from "../../blockchain-api/nft"
import type { FlowContractAddress } from "../../types/contract-address"
import { getCollectionConfig, getContractAddress } from "../../config/utils"
import type { FlowCollectionId } from "../../types/collection"
import { toFlowCollectionId } from "../../types/collection"


export type CreateCollectionRequest = {
	parentCollection?: FlowContractAddress
	name: string
	symbol: string
	royalties: FlowFee[]
	icon?: string
	description?: string
	url?: string
	supply?: number
}

export type CreateCollectionResponse = FlowTransaction & {
	collectionId: FlowCollectionId
	parentId: FlowCollectionId | null
}

export async function createCollection(
	fcl: Maybe<Fcl>,
	auth: AuthWithPrivateKey,
	network: FlowNetwork,
	request: CreateCollectionRequest,
): Promise<CreateCollectionResponse> {
	if (fcl) {
		const from = auth ? toFlowAddress((await auth()).addr) : toFlowAddress((await fcl.currentUser().snapshot()).addr!)
		if (!from) {
			throw new Error("FLOW-SDK: Can't get current user address")
		}
		const { royalties, url, icon, name: requestName, description, symbol, supply, parentCollection } = request
		const softCollection = getContractAddress(network, "SoftCollection")
		const preparedCollection = parentCollection || softCollection
		const { address, name, map, userCollectionId } = getCollectionConfig(
			network, preparedCollection,
		)
		const minterId = userCollectionId ? parseInt(userCollectionId) : undefined

		const validatedRoyalties = validateRoyalties(royalties)
		if (name === "SoftCollection") {
			const txId = await runTransaction(
				fcl,
				map,
				getNftCode(name).createCollection({
					fcl,
					address,
					royalties: validatedRoyalties,
					receiver: from,
					parentId: minterId,
					url,
					icon,
					name: requestName,
					supply,
					symbol,
					description,
				}),
				auth,
			)
			const txResult = await waitForSeal(fcl, txId)
			if (txResult.events.length) {
				const mintEvent = txResult.events.find(e => e.type.split(".")[3] === "Minted")
				if (mintEvent) {
					const { id, parentId } = mintEvent.data
					return {
						...txResult,
						collectionId: toFlowCollectionId(`${softCollection}:${id}`),
						parentId: typeof parentId === "number" ? toFlowCollectionId(`${softCollection}:${parentId}`) : null,
					}
				}
				throw new Error("Minted event not found in transaction response")
			}
		}
		throw new Error(`Not a  Flow softCollection contract: ${name}`)
	}
	throw new Error("Fcl is required for creation collection")
}
