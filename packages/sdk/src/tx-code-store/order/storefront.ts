import type { Fcl, FclArgs } from "@rarible/fcl-types"
import * as t from "@onflow/types"
import { Storefront } from "@rarible/flow-sdk-scripts"
import type { FlowCollectionName } from "../../common/collection"
import type { FlowCurrency, FlowFee } from "../../types"
import { prepareFees } from "../common/conver-fee-to-cadence"
import { prepareOrderCode } from "./prepare-order-code"

type GenerateCodeMethodResponse = {
	cadence: string,
	args: ReturnType<FclArgs>
}

type GenerateBidCodeResponse = {
	create: (currency: FlowCurrency, itemId: number, fees: FlowFee[]) => GenerateCodeMethodResponse
	update: (currency: FlowCurrency, orderId: number, fees: FlowFee[]) => GenerateCodeMethodResponse
	buy: (currency: FlowCurrency, orderId: number, address: string, fees: FlowFee[]) => GenerateCodeMethodResponse
}

export function getOrderCode(fcl: Fcl, collectionName: FlowCollectionName): GenerateBidCodeResponse {
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
	}
}
