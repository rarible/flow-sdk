import { CommonNft, Royalty, runTransaction, waitForSeal } from "@rarible/flow-sdk-scripts"
import { CONFIGS, Networks } from "../config"

export async function mint(network: Networks, collection: string, metadata: string, royalties: Royalty[]): Promise<string> {
	const collectionAddress = CONFIGS[network].contracts.CommonNFT
	const addressMap = CONFIGS[network].contracts
	switch (collection) {
		case `A.${collectionAddress}.CommonNFT.NFT`: {
			const txId = await runTransaction(network, addressMap, await CommonNft.mint(collectionAddress, metadata, royalties))
			await waitForSeal(txId)
			return txId
		}
		default: {
			throw Error(`Wrong collection: ${CONFIGS[network].contracts.commonNft}`)
		}
	}
}
