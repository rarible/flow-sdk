import type { Maybe } from "@rarible/types/build/maybe"
import type { Fcl } from "@rarible/fcl-types"
import { runTransaction, waitForSeal } from "../../common/transaction"
import type { FlowContractAddress } from "../../types/contract-address"
import type { AuthWithPrivateKey, FlowNetwork, FlowTransaction } from "../../types/types"
import { getCollectionConfig } from "../../config/utils"
import { getEnglishAuctionCode } from "../../blockchain-api/auction/english-auction"
import { getLot } from "./common/get-lot"

export type EnglishAuctionCancelRequest = {
	collection: FlowContractAddress,
	lotId: number
}

export async function cancelEnglishAuction(
	fcl: Maybe<Fcl>,
	auth: AuthWithPrivateKey,
	network: FlowNetwork,
	request: EnglishAuctionCancelRequest,
): Promise<FlowTransaction> {
	const { collection, lotId } = request
	if (fcl) {
		const { name, map } = getCollectionConfig(network, collection)
		const { currency } = await getLot(fcl, network, lotId)
		const txId = await runTransaction(
			fcl,
			map,
			getEnglishAuctionCode(fcl, name, currency).cancelLot(lotId),
			auth,
		)
		return await waitForSeal(fcl, txId)
	}
	throw new Error("Fcl is required for cancel lot")
}
