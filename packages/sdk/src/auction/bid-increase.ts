import type { Maybe } from "@rarible/types/build/maybe"
import type { Fcl } from "@rarible/fcl-types"
import type { AuthWithPrivateKey, FlowNetwork, FlowTransaction } from "../types"
import type { FlowContractAddress } from "../common/flow-address"
import { getCollectionConfig } from "../common/collection/get-config"
import { runTransaction, waitForSeal } from "../common/transaction"
import { getEnglishAuctionCode } from "../tx-code-store/auction/english-auction"
import { fixAmount } from "../common/fix-amount"
import { validateDecimalNumber } from "../common/data-validation/data-validators"
import { checkPrice } from "../common/check-price"
import { getLot } from "./common/get-lot"

export type EnglishAuctionIncreaseBidRequest = {
	collection: FlowContractAddress,
	lotId: number,
	amount: string,
}

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
		const { currency } = await getLot(fcl, network, lotId)
		const txId = await runTransaction(
			fcl,
			map,
			getEnglishAuctionCode(fcl, name, currency).increaseBid(lotId, amount),
			auth,
		)
		return await waitForSeal(fcl, txId)
	}
	throw new Error("Fcl is required for create auction bid")
}
