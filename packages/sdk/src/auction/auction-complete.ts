import type { Maybe } from "@rarible/types/build/maybe"
import type { Fcl } from "@rarible/fcl-types"
import type { AuthWithPrivateKey, FlowNetwork, FlowTransaction } from "../types"
import type { FlowContractAddress } from "../common/flow-address"
import { getCollectionConfig } from "../common/collection/get-config"
import { runTransaction, waitForSeal } from "../common/transaction"
import { getEnglishAuctionCode } from "../tx-code-store/auction/english-auction"
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
		const txId = await runTransaction(
			fcl,
			map,
			getEnglishAuctionCode(fcl, name, currency).completeLot(lotId),
			auth,
		)
		return await waitForSeal(fcl, txId)
	}
	throw new Error("Fcl is required for complete lot")
}
