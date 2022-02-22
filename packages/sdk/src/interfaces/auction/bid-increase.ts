import type { Maybe } from "@rarible/types/build/maybe"
import type { Fcl } from "@rarible/fcl-types"
import { toBn } from "@rarible/utils"
import { runTransaction, waitForSeal } from "../../common/transaction"
import { fixAmount } from "../../common/fix-amount"
import { validateDecimalNumber } from "../../common/data-validation/data-validators"
import type { AuthWithPrivateKey, FlowNetwork } from "../../types"
import type { FlowTransaction } from "../../types"
import { checkPrice } from "../order/common/check-price"
import { getCollectionConfig } from "../../config/utils"
import { getEnglishAuctionCode } from "../../blockchain-api/auction/english-auction"
import { getLot } from "./common/get-lot"
import type { EnglishAuctionIncreaseBidRequest } from "./domain"

export async function increaseBid(
	fcl: Maybe<Fcl>,
	auth: AuthWithPrivateKey,
	network: FlowNetwork,
	request: EnglishAuctionIncreaseBidRequest,
): Promise<FlowTransaction> {
	const { collection, lotId, amount } = request
	validateDecimalNumber(fixAmount(amount))
	checkPrice(amount)
	if (fcl) {
		const { name, map } = getCollectionConfig(network, collection)
		const preparedLotId = toBn(lotId).toNumber()
		const { currency } = await getLot(fcl, network, preparedLotId)
		const txId = await runTransaction(
			fcl,
			map,
			getEnglishAuctionCode(fcl, name, currency).increaseBid(preparedLotId, amount),
			auth,
		)
		return waitForSeal(fcl, txId)
	}
	throw new Error("Fcl is required for create auction bid")
}
