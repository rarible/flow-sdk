import type { Maybe } from "@rarible/types/build/maybe"
import type { Fcl } from "@rarible/fcl-types"
import { toBn } from "@rarible/utils"
import { runTransaction, waitForSeal } from "../../common/transaction"
import { fixAmount } from "../../common/fix-amount"
import { getProtocolFee } from "../order/get-protocol-fee"
import { validateDecimalNumber } from "../../common/data-validation/data-validators"
import { concatNonUniqueFees } from "../order/common/calculate-sale-cuts"
import type { AuthWithPrivateKey, FlowNetwork, FlowTransaction } from "../../types"
import { checkPrice } from "../order/common/check-price"
import { getCollectionConfig } from "../../config/utils"
import { getEnglishAuctionCode } from "../../blockchain-api/auction/english-auction"
import { CONFIGS } from "../../config/config"
import { getLot } from "./common/get-lot"
import type { EnglishAuctionCreateBidRequest } from "./domain"

export async function createBid(
	fcl: Maybe<Fcl>,
	auth: AuthWithPrivateKey,
	network: FlowNetwork,
	request: EnglishAuctionCreateBidRequest,
): Promise<FlowTransaction> {
	const { collection, lotId, amount, originFee } = request
	const preparedLotId = toBn(lotId).toNumber()
	validateDecimalNumber(fixAmount(amount))
	checkPrice(amount)
	if (fcl) {
		const { name, map } = getCollectionConfig(network, collection)
		const { currency } = await getLot(fcl, network, preparedLotId)
		const parts = concatNonUniqueFees([...originFee || [], getProtocolFee.percents(network).buyerFee])
		const txId = await runTransaction(
			fcl,
			map,
			getEnglishAuctionCode(fcl, name, currency)
				.createBid(CONFIGS[network].mainAddressMap.EnglishAuction, preparedLotId, amount, parts),
			auth,
		)
		return waitForSeal(fcl, txId)
	}
	throw new Error("Fcl is required for create auction bid")
}
