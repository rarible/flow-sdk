import { CommonNftOrder, runTransaction, waitForSeal } from "@rarible/flow-sdk-scripts"
import { CONFIGS, Networks } from "../config"

export async function sell(network: Networks, collection: string, sellItemId: number, sellItemPrice: string) {
	const collectionAddress = CONFIGS[network].contracts.CommonNFT
	const addressMap = CONFIGS[network].contracts
	switch (collection) {
		case `A.${collectionAddress}.CommonNFT.NFT`: {
			const txId = await runTransaction(network, addressMap, CommonNftOrder.sellItem(sellItemId, sellItemPrice))
			await waitForSeal(txId)
			return txId
		}
		default: {
			throw Error("Wrong collection")
		}
	}
}

