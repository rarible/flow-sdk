import type { Maybe } from "@rarible/types/build/maybe"
import type { Fcl } from "@rarible/fcl-types"
import { runTransaction, waitForSeal } from "../../common/transaction"
import type { AuthWithPrivateKey, FlowNetwork, FlowTransaction } from "../../types/types"
import type { FlowContractAddress } from "../../types/contract-address"
import { getCollectionConfig } from "../../config/utils"
import { getEnglishAuctionCode } from "../../blockchain-api/auction/english-auction"
import { getLot } from "./common/get-lot"

export type EnglishAuctionCompleteRequest = {
	collection: FlowContractAddress,
	lotId: number
}

export async function completeEnglishAuction(
	fcl: Maybe<Fcl>,
	auth: AuthWithPrivateKey,
	network: FlowNetwork,
	request: EnglishAuctionCompleteRequest,
): Promise<FlowTransaction> {
	const { collection, lotId } = request
	if (fcl) {
		const { name, map } = getCollectionConfig(network, collection)
		const { currency } = await getLot(fcl, network, lotId)
		try {
			const txId = await runTransaction(
				fcl,
				map,
				getEnglishAuctionCode(fcl, name, currency).completeLot(lotId),
				auth,
			)
			return await waitForSeal(fcl, txId)
		} catch (e) {
			const isAuctionNotFinichedYet = String(e).search("self.finishAt ?? 0.0 < getCurrentBlock().timestamp")
			if (isAuctionNotFinichedYet) {
				throw new Error("Еhe end of the auction has not yet come: auction.finishAt > currentBlock timestamp")
			}
		}
	}
	throw new Error("Fcl is required for complete lot")
}
