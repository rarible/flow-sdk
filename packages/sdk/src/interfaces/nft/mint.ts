import type { Fcl } from "@rarible/fcl-types"
import type { Maybe } from "@rarible/types/build/maybe"
import type { FlowRoyalty } from "@rarible/flow-api-client"
import { toFlowAddress } from "@rarible/types"
import type { AuthWithPrivateKey, FlowNetwork, FlowTransaction } from "../../types/types"
import { runTransaction, waitForSeal } from "../../common/transaction"
import { getNftCode } from "../../blockchain-api/nft"
import type { FlowItemId } from "../../types/item"
import { toFlowItemId } from "../../types/item"
import type { FlowContractAddress } from "../../types/contract-address"
import { getCollectionConfig } from "../../config/utils"
import { sansPrefix } from "../../common/prefix"
import { validateRoyalties } from "./common/validate-royalties"

export interface FlowMintResponse extends FlowTransaction {
	tokenId: FlowItemId
}

export async function mint(
	fcl: Maybe<Fcl>,
	auth: AuthWithPrivateKey,
	network: FlowNetwork,
	collection: FlowContractAddress,
	metadata: string,
	royalties: FlowRoyalty[],
): Promise<FlowMintResponse> {
	if (!fcl) {
		throw new Error("Fcl is required for mint")
	}
	const from = auth ? toFlowAddress((await auth()).addr) : toFlowAddress((await fcl.currentUser().snapshot()).addr!)
	if (!from) {
		throw new Error("FLOW-SDK: Can't get current user address")
	}
	const { map, address, features, name, userCollectionId } = getCollectionConfig(
		network,
		collection,
	)
	const minterId = userCollectionId
	if (features.includes("MINT")) {
		const validatedRoyalties = validateRoyalties(royalties)
		const txId = await runTransaction(
			fcl,
			map,
			await getNftCode(name).mint({ fcl, address, metadata, royalties: validatedRoyalties, receiver: from, minterId }),
			auth,
		)
		const txResult = await waitForSeal(fcl, txId)

		if (txResult.events.length) {
			const mintEvent = txResult.events.find(e => ["Mint", "Minted"].includes(e.type.split(".")[3]))
			if (mintEvent) {
				return {
					tokenId: toFlowItemId(`A.${sansPrefix(address)}.${name}:${mintEvent.data.id}`),
					...txResult,
				}
			}
			throw new Error("Mint event not found in transaction response")
		}
		throw new Error("Something went wrong, transaction sent but events is empty")
	}
	throw new Error("This collection doesn't support minting")
}
