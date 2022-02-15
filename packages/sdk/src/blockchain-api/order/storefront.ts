import type { Fcl } from "@rarible/fcl-types"
import * as t from "@onflow/types"
import { Storefront } from "@rarible/flow-sdk-scripts"
import type { FlowCurrency, FlowFee, NonFungibleContract } from "../../types/types"
import { prepareFees } from "../common/convert-fee-to-cadence"
import type { PreparedTransactionParamsResponse } from "../domain"
import { prepareOrderCode } from "./common/prepare-order-code"

type GenerateBidCodeResponse = {
	create: (currency: FlowCurrency, itemId: number, fees: FlowFee[]) => PreparedTransactionParamsResponse
	update: (currency: FlowCurrency, orderId: number, fees: FlowFee[]) => PreparedTransactionParamsResponse
	buy: (currency: FlowCurrency, orderId: number, address: string, fees: FlowFee[]) => PreparedTransactionParamsResponse
	cancel: (orderId: number) => PreparedTransactionParamsResponse
}

export function getOrderCode(fcl: Fcl, collectionName: NonFungibleContract): GenerateBidCodeResponse {
	return {
		create(currency, itemId, fees) {
			return {
				cadence: prepareOrderCode(Storefront.createSellOrder, collectionName, currency),
				args: fcl.args([
					fcl.arg(itemId, t.UInt64), fcl.arg(prepareFees(fees), t.Dictionary({
						key: t.Address,
						value: t.UFix64,
					})),
				]),
			}
		},
		update(currency, orderId, fees) {
			return {
				cadence: prepareOrderCode(Storefront.updateOrder, collectionName, currency),
				args: fcl.args([
					fcl.arg(orderId, t.UInt64), fcl.arg(prepareFees(fees), t.Dictionary({
						key: t.Address,
						value: t.UFix64,
					})),
				]),
			}
		},
		buy(currency, orderId, address, fees) {
			return {
				cadence: prepareOrderCode(Storefront.buy, collectionName, currency),
				args: fcl.args([
					fcl.arg(orderId, t.UInt64),
					fcl.arg(address, t.Address),
					fcl.arg(prepareFees(fees), t.Dictionary({ key: t.Address, value: t.UFix64 })),
				]),
			}
		},
		cancel(orderId) {
			return {
				cadence: Storefront.cancelOrder,
				args: fcl.args([fcl.arg(orderId, t.UInt64)]),
			}
		},
	}
}
