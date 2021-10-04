import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"
import { nftStorefrontScripts, nftStorefrontTransactions } from "./scripts"

export const CommonNftOrder = {
	getFees: () => ({
		cadence: fcl.script(nftStorefrontScripts.get_fees),
	}),

	readSaleOfferDetails: (address: string, saleOfferResourceId: number) => ({
		cadence: fcl.script(nftStorefrontScripts.read_sale_offer_details),
		args: fcl.args([fcl.arg(address, t.Address), fcl.arg([saleOfferResourceId, t.UInt64])]),
	}),

	readStorefrontIds: (address: string) => ({
		cadence: fcl.script(nftStorefrontScripts.read_storefront_ids),
		args: fcl.args([fcl.arg(address, t.Address)]),
	}),

	buy: (saleOfferResourceId: number, storefrontAddress: string) => ({
		cadence: fcl.transaction(nftStorefrontTransactions.buy_item),
		args: fcl.args([fcl.arg(saleOfferResourceId, t.UInt64), fcl.arg(storefrontAddress, t.Address)]),
	}),

	cleanupItem: (saleOfferResourceId: number, storefrontAddress: string) => ({
		cadence: fcl.transaction(nftStorefrontTransactions.cleanup_item),
		args: fcl.args([fcl.arg(saleOfferResourceId, t.UInt64), fcl.arg(storefrontAddress, t.Address)]),
	}),

	removeOrder: (saleOfferResourceId: number) => ({
		cadence: fcl.transaction(nftStorefrontTransactions.remove_item),
		args: fcl.args([fcl.arg(saleOfferResourceId, t.UInt64)]),
	}),

	sell: (saleItemId: number, saleItemPrice: string) => ({
		cadence: fcl.transaction(nftStorefrontTransactions.sell_item),
		args: fcl.args([fcl.arg(saleItemId, t.UInt64), fcl.arg(saleItemPrice, t.UFix64)]),
	}),

	setFees: (sellerFee: string, buyerFee: string) => ({
		cadence: fcl.transaction(nftStorefrontTransactions.set_fees),
		args: fcl.args([fcl.arg(sellerFee, t.UFix64), fcl.arg(buyerFee, t.UFix64)]),
	}),

	setupAccount: () => ({
		cadence: fcl.transaction(nftStorefrontTransactions.setup_account),
	}),
}
