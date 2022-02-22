import type { Maybe } from "@rarible/types/build/maybe"
import type { Fcl } from "@rarible/fcl-types"
import type { FlowNftItemControllerApi } from "@rarible/flow-api-client"
import { toBigNumber } from "@rarible/types"
import { runTransaction, waitForSeal } from "../../common/transaction"
import { fixAmount } from "../../common/fix-amount"
import { getProtocolFee } from "../order/get-protocol-fee"
import { parseEvents } from "../../common/parse-tx-events"
import { validateBatch } from "../../common/data-validation/validate-batch"
import { calculateSaleCuts } from "../order/common/calculate-sale-cuts"
import { getAccountAddress } from "../../common/get-account-address"
import { validateDecimalNumber } from "../../common/data-validation/data-validators"
import { extractTokenId } from "../../types/item"
import type { AuthWithPrivateKey, FlowNetwork } from "../../types"
import { checkPrice } from "../order/common/check-price"
import { getCollectionConfig } from "../../config/utils"
import { getEnglishAuctionCode } from "../../blockchain-api/auction/english-auction"
import { CONFIGS } from "../../config/config"
import { fetchItemRoyalties } from "../order/common/fetch-item-royalties"
import type { EnglishAuctionCreateRequest, FlowEnglishAuctionTransaction } from "./domain"

export async function createEnglishAuction(
	fcl: Maybe<Fcl>,
	auth: AuthWithPrivateKey,
	network: FlowNetwork,
	itemApi: FlowNftItemControllerApi,
	request: EnglishAuctionCreateRequest,
): Promise<FlowEnglishAuctionTransaction> {
	if (fcl) {
		const from = await getAccountAddress(fcl, auth)
		const {
			collection, currency, itemId, minimumBid, buyoutPrice, increment, startAt, duration, originFees, payouts,
		} = request
		validateBatch.decimal(
			fixAmount(minimumBid.toString()),
			fixAmount(increment.toString()),
			fixAmount(duration.toString()),
		)
		buyoutPrice && validateDecimalNumber(fixAmount(buyoutPrice.toString())) && checkPrice(buyoutPrice.toString())
		startAt && validateDecimalNumber(fixAmount(startAt.toString()))
		checkPrice(increment.toString())
		checkPrice(minimumBid.toString())
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
			lotId: String(simpleOrderId),
		}
	}
	throw new Error("Fcl is required for creating lot")
}
