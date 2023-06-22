import type { Fcl, FclArgs } from "@rarible/fcl-types"
import * as t from "@onflow/types"
import {
	barbieBuyTxCode,
	barbieListTxCode,
	barbieChangePriceTxCode,
	garageBuyTxCode,
	getGarageChangePriceTxCode,
	getGarageListTxCode,
	txInitNFTContractsAndStorefrontV2,
	txUnlistItemStorefrontV2,
} from "@rarible/flow-sdk-scripts"
import type { FlowAddress } from "@rarible/types"
import type { BigNumberValue } from "@rarible/utils"
import {txInitVault} from "@rarible/flow-sdk-scripts/src/cadence/nft/mattel/init-vault"
import type { NonFungibleContract } from "../../types"
import { fillCodeTemplate } from "../../common/template-replacer"
import {getNftCodeConfig} from "../../config/cadence-code-config"
import type {FlowCurrency} from "../../types"
import {prepareOrderCode} from "./prepare-order-code"

type GenerateCodeMethodResponse = {
	cadence: string,
	args: ReturnType<FclArgs>
}

export type GarageCollection =
  | "HWGaragePack"
  | "HWGarageCard"
  | "HWGarageCardV2"
  | "HWGaragePackV2"

export function isGarageCollection(collection: string): collection is MattelCollection {
	return [
		"HWGaragePack",
		"HWGarageCard",
		"HWGarageCardV2",
		"HWGaragePackV2",
	].includes(collection)
}

export type BarbieCollection =
  | "BBxBarbiePack"
  | "BBxBarbieCard"

export function isBarbieCollection(collection: string): collection is BarbieCollection {
	return [
		"BBxBarbiePack",
		"BBxBarbieCard",
	].includes(collection)
}

export type MattelCollection = GarageCollection | BarbieCollection

export function isMattelCollection(collection: string): collection is MattelCollection {
	return isGarageCollection(collection) || isBarbieCollection(collection)
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
			currency: FlowCurrency
		}): GenerateCodeMethodResponse {
			let code: string
			if (isGarageCollection(collectionName)) {
				code = getGarageListTxCode(o.collectionName)
			} else if (isBarbieCollection(collectionName)) {
				code = barbieListTxCode(collectionName)
			} else {
				throw new Error(`Unknown collection (${collectionName})`)
			}
			return {
				cadence: prepareOrderCode(code, collectionName, o.currency),
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
			marketplacesAddress: FlowAddress[],
			currency: FlowCurrency
		}): GenerateCodeMethodResponse {
			let code: string
			if (isGarageCollection(collectionName)) {
				code = getGarageChangePriceTxCode(o.collectionName)
			} else if (isBarbieCollection(collectionName)) {
				code = barbieChangePriceTxCode(collectionName)
			} else {
				throw new Error(`Unknown collection (${collectionName})`)
			}
			return {
				cadence: prepareOrderCode(code, collectionName, o.currency),
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
			currency: FlowCurrency,
			comissionRecipient?: string,
		}): GenerateCodeMethodResponse {
			let code: string
			if (isGarageCollection(collectionName)) {
				code = garageBuyTxCode
			} else if (isBarbieCollection(collectionName)) {
				code = barbieBuyTxCode
			} else {
				throw new Error(`Unknown collection (${collectionName})`)
			}
			return {
				cadence: prepareOrderCode(code, collectionName, o.currency),
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
		setupVault(): GenerateCodeMethodResponse {
			return {
				cadence: fillCodeTemplate(txInitVault, getNftCodeConfig(collectionName)),
				args: fcl.args([]),
			}
		},
	}
}
