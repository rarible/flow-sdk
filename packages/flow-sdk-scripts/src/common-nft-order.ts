import * as t from "@onflow/types"
import { nftStorefrontScripts, nftStorefrontTransactions } from "./scripts"
import { MethodArgs } from "./common"

export const CommonNftOrder = {
	getFees: (): MethodArgs => ({
		type: "script",
		cadence: nftStorefrontScripts.get_fees,
	}),

	readSaleOfferDetails: (address: string, saleOfferResourceId: number): MethodArgs => ({
		type: "script",
		cadence: nftStorefrontScripts.read_sale_offer_details,
		args: [[address, t.Address], [saleOfferResourceId, t.UInt64]],
	}),

	readStorefrontIds: (address: string): MethodArgs => ({
		type: "script",
		cadence: nftStorefrontScripts.read_storefront_ids,
		args: [[address, t.Address]],
	}),

	buyItem: (saleOfferResourceId: number, storefrontAddress: string): MethodArgs => ({
		type: "script",
		cadence: nftStorefrontTransactions.buy_item,
		args: [[saleOfferResourceId, t.UInt64], [storefrontAddress, t.Address]],
	}),

	cleanupItem: (saleOfferResourceId: number, storefrontAddress: string): MethodArgs => ({
		type: "script",
		cadence: nftStorefrontTransactions.cleanup_item,
		args: [[saleOfferResourceId, t.UInt64], [storefrontAddress, t.Address]],
	}),

	removeItem: (saleOfferResourceId: number): MethodArgs => ({
		type: "script",
		cadence: nftStorefrontTransactions.remove_item,
		args: [[saleOfferResourceId, t.UInt64]],
	}),

	sellItem: (saleItemId: number, saleItemPrice: string): MethodArgs => ({
		type: "script",
		cadence: nftStorefrontTransactions.sell_item,
		args: [[saleItemId, t.UInt64], [saleItemPrice, t.UFix64]],
	}),

	setFees: (sellerFee: string, buyerFee: string): MethodArgs => ({
		type: "script",
		cadence: nftStorefrontTransactions.set_fees,
		args: [[sellerFee, t.UFix64], [buyerFee, t.UFix64]],
	}),

	setupAccount: (): MethodArgs => ({
		type: "script",
		cadence: nftStorefrontTransactions.setup_account,
	}),
}
