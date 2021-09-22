import { CommonNftOrder, runTransaction, waitForSeal } from "@rarible/flow-sdk-scripts"
import { CONFIGS, Networks } from "../config"

export async function buy(network: Networks, collection: string, itemId: number, owner: string) {
	const collectionAddress = CONFIGS[network].contracts.CommonNFT
	const addressMap = CONFIGS[network].contracts
	switch (collection) {
		case `A.${collectionAddress}.CommonNFT.NFT`: {
			const txId = await runTransaction(network, addressMap, CommonNftOrder.buyItem(itemId, owner))
			await waitForSeal(txId)
			return txId
		}
		default: {
			throw Error("Wrong collection")
		}
	}
}
