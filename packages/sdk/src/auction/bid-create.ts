import type { Maybe } from "@rarible/types/build/maybe"
import type { Fcl } from "@rarible/fcl-types"
import type { AuthWithPrivateKey, FlowFee, FlowNetwork, FlowTransaction } from "../types"
import type { FlowContractAddress } from "../common/flow-address"
import { getCollectionConfig } from "../common/collection/get-config"
import { runTransaction, waitForSeal } from "../common/transaction"
import { getEnglishAuctionCode } from "../tx-code-store/auction/english-auction"
import { fixAmount } from "../common/fix-amount"
import { getProtocolFee } from "../order/get-protocol-fee"
import { validateDecimalNumber } from "../common/data-validation/data-validators"
import { concatNonUniqueFees } from "../order/common/calculate-sale-cuts"
import { checkPrice } from "../common/check-price"
import { getLot } from "./common/get-lot"

export type EnglishAuctionCreateBidRequest = {
	collection: FlowContractAddress,
	lotId: number,
	amount: string,
	originFee: FlowFee[]
}

export async function createBid(
	fcl: Maybe<Fcl>,
	auth: AuthWithPrivateKey,
	network: FlowNetwork,
	request: EnglishAuctionCreateBidRequest,
): Promise<FlowTransaction> {
	const { collection, lotId, amount, originFee } = request
	validateDecimalNumber(fixAmount(amount))
	checkPrice(amount)
	if (fcl) {
		const { name, map } = getCollectionConfig(network, collection)
		const { currency } = await getLot(fcl, network, lotId)
		const parts = concatNonUniqueFees([...originFee, getProtocolFee.percents(network).buyerFee])
		const txId = await runTransaction(
			fcl,
			map,
			getEnglishAuctionCode(fcl, name, currency).createBid(lotId, amount, parts),
			auth,
		)
		return await waitForSeal(fcl, txId)
	}
	throw new Error("Fcl is required for create auction bid")
}
