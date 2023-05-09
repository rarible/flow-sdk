import type { Fcl, FclArgs } from "@rarible/fcl-types"
import * as t from "@onflow/types"
import {
	getTxChangePriceStorefrontV2,
	getTxListItemStorefrontV2,
	txBuyItemStorefrontV2,
	txInitNFTContractsAndStorefrontV2,
	txUnlistItemStorefrontV2,
} from "@rarible/flow-sdk-scripts"
import type { FlowAddress } from "@rarible/types"
import type { BigNumberValue } from "@rarible/utils"
import type { NonFungibleContract } from "../../types"
import { fillCodeTemplate } from "../../common/template-replacer"
import { getNftCodeConfig } from "../../config/cadence-code-config"

type GenerateCodeMethodResponse = {
	cadence: string,
	args: ReturnType<FclArgs>
}

export type MattelCollection =
	| "HWGaragePack"
	| "HWGarageCard"
	| "HWGarageCardV2"
	| "HWGaragePackV2"
	| "BBxBarbiePack"
	| "BBxBarbieCard"

export function isMattelCollection(collection: string): collection is MattelCollection {
	return [
		"HWGaragePack",
		"HWGarageCard",
		"HWGarageCardV2",
		"HWGaragePackV2",
		"BBxBarbiePack",
		"BBxBarbieCard",
	].includes(collection)
}

export function getMattelOrderCode(fcl: Fcl, collectionName: NonFungibleContract) {
	return {
		create(o: {
			collectionName: MattelCollection
			itemId: number,
			saleItemPrice: BigNumberValue,
			customID?: string,
			commissionAmount: BigNumberValue,
			expiry: number,
			marketplacesAddress: FlowAddress[]
		}): GenerateCodeMethodResponse {
			return {
				cadence: fillCodeTemplate(getTxListItemStorefrontV2(o.collectionName), getNftCodeConfig(collectionName)),
				args: fcl.args([
					fcl.arg(o.itemId, t.UInt64),
					fcl.arg(o.saleItemPrice, t.UFix64),
					fcl.arg(o.customID || null, t.Optional(t.String)),
					fcl.arg(o.commissionAmount, t.UFix64),
					fcl.arg(o.expiry, t.UInt64),
					fcl.arg(o.marketplacesAddress, t.Array(t.Address)),
				]),
			}
		},
		update(o: {
			collectionName: MattelCollection
			orderId: number,
			itemId: number,
			saleItemPrice: BigNumberValue,
			customID?: string,
			commissionAmount: BigNumberValue,
			expiry: number,
			marketplacesAddress: FlowAddress[]
		}): GenerateCodeMethodResponse {
			return {
				cadence: fillCodeTemplate(getTxChangePriceStorefrontV2(o.collectionName), getNftCodeConfig(collectionName)),
				args: fcl.args([
					fcl.arg(o.orderId, t.UInt64),
					fcl.arg(o.itemId, t.UInt64),
					fcl.arg(o.saleItemPrice, t.UFix64),
					fcl.arg(o.customID || null, t.Optional(t.String)),
					fcl.arg(o.commissionAmount, t.UFix64),
					fcl.arg(o.expiry, t.UInt64),
					fcl.arg(o.marketplacesAddress, t.Array(t.Address)),
				]),
			}
		},
		buy(o: {
			orderId: number,
			address: string,
			comissionRecipient?: string
		}): GenerateCodeMethodResponse {
			return {
				cadence: fillCodeTemplate(txBuyItemStorefrontV2, getNftCodeConfig(collectionName)),
				args: fcl.args([
					fcl.arg(o.orderId, t.UInt64),
					fcl.arg(o.address, t.Address),
					fcl.arg(o.comissionRecipient || null, t.Optional(t.Address)),
				]),
			}
		},
		cancel(orderId: number): GenerateCodeMethodResponse {
			return {
				cadence: fillCodeTemplate(txUnlistItemStorefrontV2, getNftCodeConfig(collectionName)),
				args: fcl.args([fcl.arg(orderId, t.UInt64)]),
			}
		},
		setupAccount(): GenerateCodeMethodResponse {
			return {
				cadence: fillCodeTemplate(txInitNFTContractsAndStorefrontV2, getNftCodeConfig(collectionName)),
				args: fcl.args([]),
			}
		},
	}
}
