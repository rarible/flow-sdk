import type { Fcl, FclArgs } from "@rarible/fcl-types"
import * as t from "@onflow/types"
import {
	getTxChangePriceStorefrontV2,
	getTxListItemStorefrontV2,
	txBuyItemStorefrontV2,
	txUnlistItemStorefrontV2,
} from "@rarible/flow-sdk-scripts/src/cadence/nft/mattel-contracts-orders"
import type { Address} from "@rarible/types"
import type { BigNumberValue } from "@rarible/utils"
import type { NonFungibleContract } from "../../types"
import { fillCodeTemplate } from "../../common/template-replacer"
import { getNftCodeConfig } from "../../config/cadence-code-config"

type GenerateCodeMethodResponse = {
	cadence: string,
	args: ReturnType<FclArgs>
}

type GenerateBidCodeResponse = {
	create: (options: {
		collectionName: "HWGaragePack" | "HWGarageCard"
		itemId: number,
		saleItemPrice: BigNumberValue,
		customID?: string,
		commissionAmount: BigNumberValue,
		expiry: number,
		marketplacesAddress: Address[]
	}) => GenerateCodeMethodResponse
	update: (options: {
		collectionName: "HWGaragePack" | "HWGarageCard",
		orderId: number,
		itemId: number,
		saleItemPrice: BigNumberValue,
		customID?: string,
		commissionAmount: BigNumberValue,
		expiry: number,
		marketplacesAddress: Address[]
	}) => GenerateCodeMethodResponse
	buy: (options: {
		orderId: number,
		address: string,
		comissionRecipient?: string
	}) => GenerateCodeMethodResponse
	cancel: (orderId: number) => GenerateCodeMethodResponse
}

export function getMattelOrderCode(fcl: Fcl, collectionName: NonFungibleContract): GenerateBidCodeResponse {
	return {
		create(o) {
			return {
				cadence: fillCodeTemplate(getTxListItemStorefrontV2(o.collectionName), getNftCodeConfig(collectionName)),
				args: fcl.args([
					fcl.arg(o.itemId, t.UInt64),
					fcl.arg(o.saleItemPrice, t.UFix64),
					fcl.arg(o.customID || "", t.String),
					fcl.arg(o.commissionAmount, t.UFix64),
					fcl.arg(o.expiry, t.UInt64),
					fcl.arg(o.marketplacesAddress, t.Array(t.Address)),
				]),
			}
		},
		update(o) {
			return {
				cadence: fillCodeTemplate(getTxChangePriceStorefrontV2(o.collectionName), getNftCodeConfig(collectionName)),
				args: fcl.args([
					fcl.arg(o.orderId, t.UInt64),
					fcl.arg(o.itemId, t.UInt64),
					fcl.arg(o.saleItemPrice, t.UFix64),
					fcl.arg(o.customID || "", t.String),
					fcl.arg(o.commissionAmount, t.UFix64),
					fcl.arg(o.expiry, t.UInt64),
					fcl.arg(o.marketplacesAddress, t.Array(t.Address)),
				]),
			}
		},
		buy(o) {
			return {
				// cadence: prepareOrderCode(, collectionName, currency),
				cadence: fillCodeTemplate(txBuyItemStorefrontV2, getNftCodeConfig(collectionName)),
				args: fcl.args([
					fcl.arg(o.orderId, t.UInt64),
					fcl.arg(o.address, t.Address),
					fcl.arg(o.comissionRecipient || "", t.Address),
				]),
			}
		},
		cancel(orderId) {
			return {
				cadence: txUnlistItemStorefrontV2,
				args: fcl.args([fcl.arg(orderId, t.UInt64)]),
			}
		},
	}
}
