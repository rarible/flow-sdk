import type { Fcl } from "@rarible/fcl-types"
import type { FlowNetwork, FlowTransaction } from "../types"
import { runTransaction, waitForSeal } from "../common/transaction"
import { getNftCode } from "../tx-code-store/nft"
import type { AuthWithPrivateKey, FlowRoyalty } from "../types"
import { getCollectionConfig } from "../common/collection/get-config"
import type { FlowContractAddress } from "../common/flow-address"

export interface FlowMintResponse extends FlowTransaction {
	tokenId: number
}

export async function mint(
	fcl: Fcl,
	auth: AuthWithPrivateKey,
	network: FlowNetwork,
	collection: FlowContractAddress,
	metadata: string,
	royalties: FlowRoyalty[]
): Promise<FlowMintResponse> {
	const { map, address, config, name } = getCollectionConfig(
		network,
		collection
	)
	if (config.mintable) {
		const txId = await runTransaction(
			fcl,
			map,
			getNftCode(name).mint(fcl, address, metadata, royalties),
			auth
		)
		const txResult = await waitForSeal(fcl, txId)
		if (txResult.events.length) {
			const mintEvent = txResult.events.find(e => e.type.split(".")[3] === "Mint")
			if (mintEvent) {
				return {
					tokenId: mintEvent.data.id,
					...txResult,
				}
			}
			throw new Error("Mint event not found in transaction response")
		}
		throw new Error("Something went wrong, transaction sent but events is empty")
	}
	throw new Error("This collection doesn't support 'mint'")
}
