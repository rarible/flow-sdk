import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"
import { nftStorefrontScripts, nftStorefrontTransactions } from "./scripts"

export const CommonNftOrder = {
	getFees: () => [
		fcl.script(nftStorefrontScripts.get_fees),
	],

	readSaleOfferDetails: (address: string, saleOfferResourceId: number) => [
		fcl.script(nftStorefrontScripts.read_sale_offer_details),
		fcl.args([fcl.arg(address, t.Address), fcl.arg([saleOfferResourceId, t.UInt64])]),
	],

	readStorefrontIds: (address: string) => [
		fcl.script(nftStorefrontScripts.read_storefront_ids),
		fcl.args([fcl.arg(address, t.Address)]),
	],

	buyItem: (saleOfferResourceId: number, storefrontAddress: string) => [
		fcl.transaction(nftStorefrontTransactions.buy_item),
		fcl.args([fcl.arg(saleOfferResourceId, t.UInt64), fcl.arg(storefrontAddress, t.Address)]),
	],

	cleanupItem: (saleOfferResourceId: number, storefrontAddress: string) => [
		fcl.transaction(nftStorefrontTransactions.cleanup_item),
		fcl.args([fcl.arg(saleOfferResourceId, t.UInt64), fcl.arg(storefrontAddress, t.Address)]),
	],

	removeItem: (saleOfferResourceId: number) => [
		fcl.transaction(nftStorefrontTransactions.remove_item),
		fcl.args([fcl.arg(saleOfferResourceId, t.UInt64)]),
	],

	sellItem: (saleItemId: number, saleItemPrice: string) => [
		fcl.transaction(nftStorefrontTransactions.sell_item),
		fcl.args([fcl.arg(saleItemId, t.UInt64), fcl.arg(saleItemPrice, t.UFix64)]),
	],

	setFees: (sellerFee: string, buyerFee: string) => [
		fcl.transaction(nftStorefrontTransactions.set_fees),
		fcl.args([fcl.arg(sellerFee, t.UFix64), fcl.arg(buyerFee, t.UFix64)]),
	],

	setupAccount: () => [
		fcl.transaction(nftStorefrontTransactions.setup_account),
	],
}
