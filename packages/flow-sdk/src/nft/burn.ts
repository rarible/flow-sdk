import { CommonNft, runTransaction, waitForSeal } from "@rarible/flow-sdk-scripts"
import { CONFIGS, Networks } from "../config"

export async function burn(network: Networks, collection: string, tokenId: number): Promise<string> {
	const collectionAddress = CONFIGS[network].contracts.CommonNFT
	const addressMap = CONFIGS[network].contracts
	switch (collection) {
		case `A.${collectionAddress}.CommonNFT.NFT`: {
			const txId = await runTransaction(network, addressMap, CommonNft.burn(tokenId))
			await waitForSeal(txId)
			return txId
		}
		default: {
			throw Error("Wrong collection")
		}
	}
}
