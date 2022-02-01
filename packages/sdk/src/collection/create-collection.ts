import type { Fcl } from "@rarible/fcl-types"
import type { Maybe } from "@rarible/types/build/maybe"
import type { FlowAddress } from "@rarible/types"
import { toFlowAddress } from "@rarible/types"
import type { AuthWithPrivateKey, FlowFee, FlowNetwork, FlowTransaction } from "../types"
import type { FlowContractAddress } from "../common/flow-address"
import { getCollectionConfig } from "../common/collection/get-config"
import { validateRoyalties } from "../nft/common/validate-royalties"
import { runTransaction, waitForSeal } from "../common/transaction"
import { getNftCode } from "../tx-code-store/nft"
import { getCollectionId } from "../config/config"


export type CreateCollectionRequest = {
	collection?: FlowContractAddress
	receiver: FlowAddress
	name: string
	symbol: string
	royalties: FlowFee[]
	icon?: string
	description?: string
	url?: string
	supply?: number
}

export type CreateCollectionResponse = FlowTransaction & {
	collectionId: number
	parentId: number
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
		const { royalties, url, icon, name: requestName, description, symbol, supply, receiver } = request
		const preparedCollection = request.collection || getCollectionId(network, "SoftCollection")
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
					receiver,
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
					return {
						...txResult,
						collectionId: mintEvent.data.id,
						parentId: mintEvent.data.parentId,
					}
				}
				throw new Error("Deposit event not found in transaction response")
			}
		}
		throw new Error(`Not a  Flow softCollection contract: ${name}`)
	}
	throw new Error("Fcl is required for creation collection")
}
