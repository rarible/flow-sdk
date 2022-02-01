import type { Fcl } from "@rarible/fcl-types"
import type { Maybe } from "@rarible/types/build/maybe"
import { toFlowAddress } from "@rarible/types"
import type { AuthWithPrivateKey, FlowFee, FlowNetwork, FlowTransaction } from "../types"
import type { FlowContractAddress } from "../common/flow-address"
import { getCollectionConfig } from "../common/collection/get-config"
import { validateRoyalties } from "../nft/common/validate-royalties"
import { runTransaction, waitForSeal } from "../common/transaction"
import { getNftCode } from "../tx-code-store/nft"
import { getCollectionId } from "../config/config"

export type CreateCollectionRequest = {
	collection?: FlowContractAddress,
	name: string,
	symbol: string,
	royalties: FlowFee[]
	icon?: string
	description?: string
	url?: string
	supply?: number
}

export async function createCollection(
	fcl: Maybe<Fcl>,
	auth: AuthWithPrivateKey,
	network: FlowNetwork,
	request: CreateCollectionRequest,
): Promise<FlowTransaction> {
	if (fcl) {
		const from = auth ? toFlowAddress((await auth()).addr) : toFlowAddress((await fcl.currentUser().snapshot()).addr!)
		if (!from) {
			throw new Error("FLOW-SDK: Can't get current user address")
		}
		const { collection, royalties, url, icon, name: requestName, description, symbol, supply } = request
		const { address, name, map, userCollectionId } = getCollectionConfig(
			network, collection || getCollectionId(network, "SoftCollection"),
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
					from,
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
			return waitForSeal(fcl, txId)
		}
		throw new Error(`Not a  Flow softCollection contract: ${name}`)
	}
	throw new Error("Fcl is required for creation collection")
}
