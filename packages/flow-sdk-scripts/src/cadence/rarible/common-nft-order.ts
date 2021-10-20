import * as t from "@onflow/types"
import { Fcl } from "@rarible/fcl-types"
import { nftStorefrontScripts, nftStorefrontTransactions } from "./scripts"

export const CommonNftOrder = {
	getFees: (fcl: Fcl) => ({
		cadence: fcl.script(nftStorefrontScripts.get_fees),
	}),

	readSaleOfferDetails: (fcl: Fcl, address: string, saleOfferResourceId: number) => ({
		cadence: fcl.script(nftStorefrontScripts.read_sale_offer_details),
		args: fcl.args([fcl.arg(address, t.Address), fcl.arg([saleOfferResourceId, t.UInt64])]),
	}),

	readStorefrontIds: (fcl: Fcl, address: string) => ({
		cadence: fcl.script(nftStorefrontScripts.read_storefront_ids),
		args: fcl.args([fcl.arg(address, t.Address)]),
	}),

	buy: (fcl: Fcl, saleOfferResourceId: number, storefrontAddress: string) => {
		return {
			cadence: fcl.transaction(nftStorefrontTransactions.buy_item),
			args: fcl.args([fcl.arg(saleOfferResourceId, t.UInt64), fcl.arg(storefrontAddress, t.Address)]),
		}
	},

	cleanupItem: (fcl: Fcl, saleOfferResourceId: number, storefrontAddress: string) => ({
		cadence: fcl.transaction(nftStorefrontTransactions.cleanup_item),
		args: fcl.args([fcl.arg(saleOfferResourceId, t.UInt64), fcl.arg(storefrontAddress, t.Address)]),
	}),

	removeOrder: (fcl: Fcl, saleOfferResourceId: number) => ({
		cadence: fcl.transaction(nftStorefrontTransactions.remove_item),
		args: fcl.args([fcl.arg(saleOfferResourceId, t.UInt64)]),
	}),

	sell: (fcl: Fcl, saleItemId: number, saleItemPrice: string) => {
		return {
			cadence: fcl.transaction(nftStorefrontTransactions.sell_item),
			args: fcl.args([fcl.arg(saleItemId, t.UInt64), fcl.arg(saleItemPrice, t.UFix64)]),
		}
	},

	setFees: (fcl: Fcl, sellerFee: string, buyerFee: string) => ({
		cadence: fcl.transaction(nftStorefrontTransactions.set_fees),
		args: fcl.args([fcl.arg(sellerFee, t.UFix64), fcl.arg(buyerFee, t.UFix64)]),
	}),

	setupAccount: (fcl: Fcl) => ({
		cadence: fcl.transaction(nftStorefrontTransactions.setup_account),
	}),
}
