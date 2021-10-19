import { Fcl } from "@rarible/fcl-types"
import { Royalty } from "@rarible/flow-sdk-scripts"
import { Networks } from "../config"
import { runTransaction, waitForSeal } from "../common/transaction"
import { getNftCode } from "../txCodeStore/ntf"
import { getCollectionConfig } from "../common/get-collection-config"

export async function mint(
	fcl: Fcl, auth: any, network: Networks, collection: string, metadata: string, royalties: Royalty[],
): Promise<number> {
	const { addressMap, collectionAddress, collectionConfig, collectionName } = getCollectionConfig(network, collection)
	if (collectionConfig.mintable) {
		const txId = await runTransaction(
			fcl, addressMap, getNftCode(collectionName).mint(fcl, collectionAddress, metadata, royalties), auth,
		)
		const txResult = await waitForSeal(fcl, txId)
		if (txResult.events.length) {
			return txResult.events[0].data.id
		} else {
			throw Error("Something went wrong, transaction sent but events is empty")
		}
	} else {
		throw Error("This collection doesn't support 'mint'")
	}
}
