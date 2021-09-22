import { CommonNft, runTransaction, waitForSeal } from "@rarible/flow-sdk-scripts"
import { CONFIGS, Networks } from "../config"

export async function transfer(network: Networks, collection: string, tokenId: number, to: string): Promise<string> {
	const collectionAddress = CONFIGS[network].contracts.CommonNFT
	const addressMap = CONFIGS[network].contracts
	switch (collection) {
		case `A.${collectionAddress}.CommonNFT.NFT`: {
			const txId = await runTransaction(network, addressMap, CommonNft.transfer(tokenId, to))
			await waitForSeal(txId)
			return txId
		}
		default: {
			throw Error("Wrong collection")
		}
	}
}
