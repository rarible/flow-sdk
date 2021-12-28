import type { Maybe } from "@rarible/types/build/maybe"
import type { Fcl } from "@rarible/fcl-types"
import type { FlowNftItemControllerApi } from "@rarible/flow-api-client"
import { toBigNumber } from "@rarible/types"
import type { AuthWithPrivateKey, FlowCurrency, FlowNetwork, FlowOriginFees, FlowPayouts } from "../types"
import type { FlowContractAddress } from "../common/flow-address"
import type { FlowItemId } from "../common/item"
import { extractTokenId } from "../common/item"
import { checkPrice } from "../common/check-price"
import type { FlowSellResponse } from "../order/sell"
import { retry } from "../common/retry"
import { getCollectionConfig } from "../common/collection/get-config"
import { runTransaction, waitForSeal } from "../common/transaction"
import { fixAmount } from "../common/fix-amount"
import { getProtocolFee } from "../order/get-protocol-fee"
import { parseEvents } from "../common/parse-tx-events"
import { getEnglishAuctionCode } from "../tx-code-store/auction/english-auction"
import { validateBatch } from "../common/data-validation/validate-batch"
import { calculateSaleCuts } from "../order/common/calculate-sale-cuts"
import { getAccountAddress } from "../common/get-account-address"

export type EnglishAuctionCreateRequest = {
	collection: FlowContractAddress,
	currency: FlowCurrency,
	itemId: FlowItemId,
	minimumBid: string,
	buyoutPrice: string,
	increment: string,
	startAt: string,
	duration: string,
	originFees?: FlowOriginFees,
	payouts?: FlowPayouts,
}

export async function createEnglishAuction(
	fcl: Maybe<Fcl>,
	auth: AuthWithPrivateKey,
	network: FlowNetwork,
	itemApi: FlowNftItemControllerApi,
	request: EnglishAuctionCreateRequest,
): Promise<FlowSellResponse> {
	if (fcl) {
		const from = await getAccountAddress(fcl, auth)
		const {
			collection, currency, itemId, minimumBid, buyoutPrice, increment, startAt, duration, originFees, payouts,
		} = request
		validateBatch.decimal(
			fixAmount(minimumBid),
			fixAmount(buyoutPrice),
			fixAmount(increment),
			fixAmount(startAt),
			fixAmount(duration),
		)
		checkPrice(buyoutPrice)
		checkPrice(increment)
		checkPrice(minimumBid)
		const { royalties } = network === "emulator" ?
			{ royalties: [] } :
			await retry(10, 1000, async () => itemApi.getNftItemById({ itemId }))
		const { name, map } = getCollectionConfig(network, collection)
		const parts = calculateSaleCuts(
			from,
			toBigNumber("1"),
			[
				getProtocolFee.percents(network).sellerFee,
				...(originFees || []),
				...(royalties || []),
			],
			payouts || []
		)
		const txId = await runTransaction(
			fcl,
			map,
			getEnglishAuctionCode(fcl, name, currency).createLot(
				extractTokenId(request.itemId),
				minimumBid,
				buyoutPrice,
				increment,
				startAt,
				duration,
				parts,
			),
			auth,
		)
		const tx = await waitForSeal(fcl, txId)
		const simpleOrderId = parseEvents<string>(tx.events, "LotAvailable", "lotId")
		return {
			...tx,
			orderId: parseInt(simpleOrderId),
		}
	}
	throw new Error("Fcl is required for creating lot")
}
