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
	gamisodesListTxCode,
} from "@rarible/flow-sdk-scripts"
import type { FlowAddress } from "@rarible/types"
import type { BigNumberValue } from "@rarible/utils"
import {txInitVault} from "@rarible/flow-sdk-scripts"
import {gamisodesBuyTxCode} from "@rarible/flow-sdk-scripts/build/cadence/nft/gamisodes/buy"
import {gamisodesChangePriceTxCode} from "@rarible/flow-sdk-scripts/build/cadence/nft/gamisodes/change-price"
import type { NonFungibleContract } from "../../types"
import { fillCodeTemplate } from "../../common/template-replacer"
import {getNftCodeConfig} from "../../config/cadence-code-config"
import type {FlowCurrency} from "../../types"
import {prepareOrderCode} from "./prepare-order-code"

type GenerateCodeMethodResponse = {
	cadence: string,
	args: ReturnType<FclArgs>
}

export type GarageCollection = "HWGaragePack" | "HWGarageCard" | "HWGarageCardV2" | "HWGaragePackV2" | "HWGarageTokenV2"


export function isGarageCollection(collection: string): collection is GarageCollection {
	return [
		"HWGaragePack",
		"HWGarageCard",
		"HWGarageCardV2",
		"HWGaragePackV2",
		"HWGarageTokenV2",
	].includes(collection)
}

export type BarbieCollection =
  | "BBxBarbiePack"
  | "BBxBarbieCard"
  | "BBxBarbieToken"


export function isBarbieCollection(collection: string): collection is BarbieCollection {
	return [
		"BBxBarbiePack",
		"BBxBarbieCard",
		"BBxBarbieToken",
	].includes(collection)
}

export function isGamisodesCollection(collection: string): collection is GamisodesCollection {
	return [
		"Gamisodes",
	].includes(collection)
}

export type GamisodesCollection = "Gamisodes"

export type WhitelabelCollection = GarageCollection | BarbieCollection | GamisodesCollection

export function isWhitelabelCollection(collection: string): collection is WhitelabelCollection {
	return isGarageCollection(collection) || isBarbieCollection(collection) || isGamisodesCollection(collection)
}

export function getWhitelabelOrderCode(fcl: Fcl, collectionName: NonFungibleContract) {
	return {
		create(o: {
			collectionName: WhitelabelCollection
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
				code = getGarageListTxCode(o.collectionName, o.currency)
			} else if (isBarbieCollection(collectionName)) {
				code = barbieListTxCode(collectionName, o.currency)
			} else if (isGamisodesCollection(collectionName)) {
				code = gamisodesListTxCode(o.currency)
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
			collectionName: WhitelabelCollection
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
				code = getGarageChangePriceTxCode(o.collectionName, o.currency)
			} else if (isBarbieCollection(collectionName)) {
				code = barbieChangePriceTxCode(collectionName, o.currency)
			} else if (isGamisodesCollection(collectionName)) {
				code = gamisodesChangePriceTxCode(o.currency)
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
			} else if (isGamisodesCollection(collectionName)) {
				code = gamisodesBuyTxCode
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
