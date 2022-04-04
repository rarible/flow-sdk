import type { Maybe } from "@rarible/types/build/maybe"
import type { Fcl } from "@rarible/fcl-types"
import { toBn } from "@rarible/utils"
import { runTransaction, waitForSeal } from "../../common/transaction"
import type { AuthWithPrivateKey, FlowNetwork, FlowTransaction } from "../../types"
import { getCollectionConfig } from "../../config/utils"
import { getEnglishAuctionCode } from "../../blockchain-api/auction/english-auction"
import { getErrorMessage } from "../../blockchain-api/errors"
import { getLot } from "./common/get-lot"
import type { EnglishAuctionCompleteRequest } from "./domain"

export async function completeEnglishAuction(
	fcl: Maybe<Fcl>,
	auth: AuthWithPrivateKey,
	network: FlowNetwork,
	request: EnglishAuctionCompleteRequest,
): Promise<FlowTransaction> {
	const { collection, lotId } = request
	const preparedLotId = toBn(lotId).toNumber()
	if (fcl) {
		const { name, map } = getCollectionConfig(network, collection)
		const { currency } = await getLot(fcl, network, preparedLotId)
		try {
			const txId = await runTransaction(
				fcl,
				map,
				getEnglishAuctionCode(fcl, name, currency).completeLot(preparedLotId),
				auth,
			)
			return waitForSeal(fcl, txId)
		} catch (e) {
			const error = getErrorMessage(e as string, "englishAuction")
			throw new Error(error)
		}
	}
	throw new Error("Fcl is required for complete lot")
}