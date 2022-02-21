import type { Maybe } from "@rarible/types/build/maybe"
import type { Fcl } from "@rarible/fcl-types"
import type { FlowNftItemControllerApi } from "@rarible/flow-api-client"
import { toBigNumber } from "@rarible/types"
import type { FlowSellResponse } from "../order/sell"
import { runTransaction, waitForSeal } from "../../common/transaction"
import { fixAmount } from "../../common/fix-amount"
import { getProtocolFee } from "../order/get-protocol-fee"
import { parseEvents } from "../../common/parse-tx-events"
import { validateBatch } from "../../common/data-validation/validate-batch"
import { calculateSaleCuts } from "../order/common/calculate-sale-cuts"
import { getAccountAddress } from "../../common/get-account-address"
import { validateDecimalNumber } from "../../common/data-validation/data-validators"
import type { FlowContractAddress } from "../../types/contract-address"
import type { FlowItemId } from "../../types/item"
import { extractTokenId } from "../../types/item"
import type { AuthWithPrivateKey, FlowCurrency, FlowNetwork, FlowOriginFees, FlowPayouts } from "../../types/types"
import { checkPrice } from "../order/common/check-price"
import { getCollectionConfig } from "../../config/utils"
import { getEnglishAuctionCode } from "../../blockchain-api/auction/english-auction"
import { CONFIGS } from "../../config/config"
import { fetchItemRoyalties } from "../order/common/fetch-item-royalties"

export type EnglishAuctionCreateRequest = {
	collection: FlowContractAddress,
	currency: FlowCurrency,
	itemId: FlowItemId,
	minimumBid: string,
	buyoutPrice?: string,
	increment: string,
	startAt?: string,
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
			fixAmount(increment),
			fixAmount(duration),
		)
		buyoutPrice && validateDecimalNumber(fixAmount(buyoutPrice)) && checkPrice(buyoutPrice)
		startAt && validateDecimalNumber(fixAmount(startAt))
		checkPrice(increment)
		checkPrice(minimumBid)
		const royalties = network === "emulator" ? [] : await fetchItemRoyalties(itemApi, itemId)
		const { name, map } = getCollectionConfig(network, collection)
		const parts = calculateSaleCuts(
			from,
			toBigNumber("1"),
			[
				getProtocolFee.percents(network).sellerFee,
				...(originFees || []),
				...(royalties || []),
			],
			payouts || [],
		)
		const txId = await runTransaction(
			fcl,
			map,
			getEnglishAuctionCode(fcl, name, currency).createLot({
				auctionContractAddress: CONFIGS[network].mainAddressMap.EnglishAuction,
				tokenId: extractTokenId(request.itemId),
				minimumBid,
				buyoutPrice,
				increment,
				startAt,
				duration,
				parts,
			}),
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
