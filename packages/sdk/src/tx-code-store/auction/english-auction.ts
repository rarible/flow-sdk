import type { Fcl } from "@rarible/fcl-types"
import * as t from "@onflow/types"
import { englishAuctionTxCode } from "@rarible/flow-sdk-scripts"
import type { FlowCollectionName } from "../../common/collection"
import { flowCollections } from "../../common/collection"
import type { FlowCurrency, FlowFee } from "../../types"
import { prepareFees } from "../common/conver-fee-to-cadence"
import { prepareOrderCode } from "../order/prepare-order-code"
import { fixAmount } from "../../common/fix-amount"
import type { PreparedTransactionParamsResponse } from "../domain"
import { logger } from "../../test/logger"

type TxCreateEnglishAutcionLotRequest = {
	tokenId: number,
	parts: FlowFee[],
	minimumBid: string,
	buyoutPrice?: string,
	increment: string,
	startAt?: string,
	duration: string,
}

interface GetEnglishAuctionCode {
	createLot(request: TxCreateEnglishAutcionLotRequest): PreparedTransactionParamsResponse

	cancelLot(lotId: number): PreparedTransactionParamsResponse

	completeLot(lotId: number): PreparedTransactionParamsResponse

	createBid(lotId: number, amount: string, parts: FlowFee[]): PreparedTransactionParamsResponse

	increaseBid(lotId: number, amount: string): PreparedTransactionParamsResponse

}

export function getEnglishAuctionCode(
	fcl: Fcl, name: FlowCollectionName, currency: FlowCurrency,
): GetEnglishAuctionCode {
	if (flowCollections.includes(name)) {
		return {
			createLot: ({ tokenId, minimumBid, buyoutPrice, increment, startAt, duration, parts }) => {
				logger("create lot")
				logger(
					"create lot", "\n",
					"tokenId", tokenId, "\n",
					"parts", parts, "\n",
					"minimumBid", fixAmount(minimumBid), "\n",
					"buyoutPrice", buyoutPrice ? fixAmount(buyoutPrice) : null, "\n",
					"increment", fixAmount(increment), "\n",
					"startAt", startAt ? fixAmount(startAt) : null, "\n",
					"duration", fixAmount(duration), "\n",
				)
				return {
					cadence: prepareOrderCode(englishAuctionTxCode.addLot, name, currency),
					args: fcl.args([
						fcl.arg(tokenId, t.UInt64),
						fcl.arg(prepareFees(parts), t.Dictionary({
							key: t.Address,
							value: t.UFix64,
						})),
						fcl.arg(fixAmount(minimumBid), t.UFix64),
						fcl.arg(buyoutPrice ? fixAmount(buyoutPrice) : null, t.Optional(t.UFix64)),
						fcl.arg(fixAmount(increment), t.UFix64),
						fcl.arg(startAt ? fixAmount(startAt) : null, t.Optional(t.UFix64)),
						fcl.arg(fixAmount(duration), t.UFix64),
					]),
				}
			},
			cancelLot: (lotId) => {
				return {
					cadence: prepareOrderCode(englishAuctionTxCode.cancelLot, name, currency),
					args: fcl.args([fcl.arg(lotId, t.UInt64)]),
				}
			},
			completeLot: (lotId) => {
				logger(
					"complete lot", "\n",
					"lotId", lotId,
				)
				return {
					cadence: prepareOrderCode(englishAuctionTxCode.completeLot, name, currency),
					args: fcl.args([fcl.arg(lotId, t.UInt64)]),
				}
			},
			createBid: (lotId, amount, parts) => {
				logger(
					"createBid", "\n",
					"lotId", lotId, "\n",
					"amount", fixAmount(amount), "\n",
					"parts", prepareFees(parts), "\n",
				)
				return {
					cadence: prepareOrderCode(englishAuctionTxCode.addBid, name, currency),
					args: fcl.args([
						fcl.arg(lotId, t.UInt64),
						fcl.arg(fixAmount(amount), t.UFix64),
						fcl.arg(prepareFees(parts), t.Dictionary({
							key: t.Address,
							value: t.UFix64,
						})),
					]),
				}
			},
			increaseBid: (lotId, amount) => {
				logger(
					"increaseBid", "\n",
					"lotId", lotId, "\n",
					"amount", fixAmount(amount), "\n",
				)
				return {
					cadence: prepareOrderCode(englishAuctionTxCode.incrementBid, name, currency),
					args: fcl.args([
						fcl.arg(lotId, t.UInt64),
						fcl.arg(fixAmount(amount), t.UFix64),
					]),
				}
			},
		}
	}
	throw new Error(`Flow-sdk: Unsupported collection: ${name}`)
}
