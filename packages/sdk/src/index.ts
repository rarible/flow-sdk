import type { Fcl } from "@rarible/fcl-types"
import type { Maybe } from "@rarible/types/build/maybe"
import type { ConfigurationParameters, FlowOrder, FlowRoyalty } from "@rarible/flow-api-client"
import * as ApiClient from "@rarible/flow-api-client"
import type { BigNumber, FlowAddress } from "@rarible/types"
import type { FlowMintResponse } from "./nft/mint"
import { mint } from "./nft/mint"
import { burn } from "./nft/burn"
import { transfer as transferTemplate } from "./nft/transfer"
import type { FlowSellRequest, FlowSellResponse } from "./order/sell"
import { sell } from "./order/sell"
import { fill } from "./order/fill/fill"
import { cancelOrder } from "./order/cancel-order"
import { signUserMessage } from "./signature/sign-user-message"
import { getFungibleBalance } from "./wallet/get-fungible-balance"
import { bid } from "./order/bid"
import { bidUpdate } from "./order/bid-update"
import { cancelBid } from "./order/cancel-bid"
import { setupAccount } from "./collection/setup-account"
import type { ProtocolFees } from "./order/get-protocol-fee"
import { getProtocolFee } from "./order/get-protocol-fee"
import type { AuthWithPrivateKey, FlowCurrency, FlowEnv, FlowOriginFees, FlowTransaction } from "./types"
import type { FlowUpdateOrderRequest } from "./order/update-order"
import { updateOrder } from "./order/update-order"
import type { FlowItemId } from "./common/item"
import type { FlowContractAddress } from "./common/flow-address"
import type { FlowEnvConfig } from "./config/env"
import { ENV_CONFIG } from "./config/env"
import type { EnglishAuctionCreateRequest } from "./auction/auction-create"
import { createEnglishAuction } from "./auction/auction-create"

export interface FlowApisSdk {
	order: ApiClient.FlowOrderControllerApi
	collection: ApiClient.FlowNftCollectionControllerApi
	item: ApiClient.FlowNftItemControllerApi
	ownership: ApiClient.FlowNftOwnershipControllerApi
}

export interface FlowNftSdk {
	/**
	 * Mint new NFT in specific collection
	 * @param collection
	 * @param metadata
	 * @param royalties
	 */
	mint(collection: FlowContractAddress, metadata: string, royalties: FlowRoyalty[]): Promise<FlowMintResponse>

	/**
	 * Transfer NFT to flow user
	 * @param collection
	 * @param tokenId
	 * @param to
	 */
	transfer(collection: FlowContractAddress, tokenId: number, to: FlowAddress): Promise<FlowTransaction>

	/**
	 * Burn specific NFT token
	 * @param collection
	 * @param tokenId
	 */
	burn(collection: FlowContractAddress, tokenId: number): Promise<FlowTransaction>
}

export interface FlowOrderSdk {
	/**
	 * Create sell order for NFT token
	 */
	sell(sellRequest: FlowSellRequest): Promise<FlowSellResponse>

	/**
	 * Update sell order
	 */
	updateOrder(
		updateRequest: FlowUpdateOrderRequest,
	): Promise<FlowSellResponse>

	/**
	 * Initiate NFT purchase
	 */
	fill(
		collection: FlowContractAddress,
		currency: FlowCurrency,
		orderId: number | FlowOrder,
		owner: string,
		fees: FlowOriginFees,
	): Promise<FlowTransaction>

	/**
	 * Cancel sell order
	 * @param collection
	 * @param orderId
	 */
	cancelOrder(collection: FlowContractAddress, orderId: number): Promise<FlowTransaction>

	/**
	 * Create bid
	 * @param collection
	 * @param currency
	 * @param itemId
	 * @param price
	 * @param originFee
	 */
	bid(
		collection: FlowContractAddress,
		currency: FlowCurrency,
		itemId: FlowItemId,
		price: BigNumber,
		originFee?: FlowOriginFees,
	): Promise<FlowSellResponse>

	/**
	 * @param collection
	 * @param currency
	 * @param order
	 * @param price
	 */
	bidUpdate(
		collection: FlowContractAddress,
		currency: FlowCurrency,
		order: number | FlowOrder,
		price: BigNumber,
	): Promise<FlowSellResponse>

	/**
	 * Cancel sell order
	 * @param collection
	 * @param orderId
	 */
	cancelBid(collection: FlowContractAddress, orderId: number): Promise<FlowTransaction>

	getProtocolFee(): ProtocolFees
}

export interface FlowEnglishAuctionSdk {
	createLot(request: EnglishAuctionCreateRequest): Promise<FlowSellResponse>
}

export interface FlowWalletSdk {
	getFungibleBalance(address: FlowAddress, currency: FlowCurrency): Promise<string>
}

export interface FlowCollectionSdk {
	setupAccount(collection: FlowContractAddress): Promise<FlowTransaction>
}

export interface FlowSdk {
	apis: FlowApisSdk
	nft: FlowNftSdk
	order: FlowOrderSdk
	collection: FlowCollectionSdk
	wallet: FlowWalletSdk
	auction: FlowEnglishAuctionSdk

	signUserMessage(message: string): Promise<string>
}

export function createFlowApisSdk(
	env: FlowEnv,
	params: ConfigurationParameters = {},
): FlowApisSdk {
	const configuration = new ApiClient.Configuration({
		basePath: ENV_CONFIG[env].basePath,
		...params,
	})
	return {
		collection: new ApiClient.FlowNftCollectionControllerApi(configuration),
		item: new ApiClient.FlowNftItemControllerApi(configuration),
		ownership: new ApiClient.FlowNftOwnershipControllerApi(configuration),
		order: new ApiClient.FlowOrderControllerApi(configuration),
	}
}

/**
 * Creates new instance of FlowSdk
 * @param fcl
 * @param network
 * @param params - api configuration
 * @param auth - optional, only for testing purposes
 */
export function createFlowSdk(
	fcl: Maybe<Fcl>,
	network: FlowEnv,
	params?: ConfigurationParameters,
	auth?: AuthWithPrivateKey,
): FlowSdk {
	const blockchainNetwork = ENV_CONFIG[network].network
	const apis = createFlowApisSdk(network, params)
	return {
		apis,
		nft: {
			mint: mint.bind(null, fcl, auth, blockchainNetwork),
			burn: burn.bind(null, fcl, auth, blockchainNetwork),
			transfer: transferTemplate.bind(null, fcl, auth, blockchainNetwork),
		},
		order: {
			sell: sell.bind(null, fcl, apis.item, auth, blockchainNetwork),
			fill: fill.bind(null, fcl, auth, blockchainNetwork, apis.order).bind(null, apis.item),
			cancelOrder: cancelOrder.bind(null, fcl, auth, blockchainNetwork),
			updateOrder: updateOrder.bind(
				null, fcl, apis.order, auth).bind(null, blockchainNetwork,
			),
			bid: bid.bind(null, fcl, auth, blockchainNetwork),
			bidUpdate: bidUpdate.bind(null, fcl, auth, blockchainNetwork, apis.order),
			cancelBid: cancelBid.bind(null, fcl, auth, blockchainNetwork),
			getProtocolFee: getProtocolFee.bind(null, blockchainNetwork),
		},
		auction: {
			createLot: createEnglishAuction.bind(null, fcl, auth, blockchainNetwork, apis.item),
		},
		wallet: {
			getFungibleBalance: getFungibleBalance.bind(null, fcl, blockchainNetwork),
		},
		collection: {
			setupAccount: setupAccount.bind(null, fcl, auth, blockchainNetwork),
		},
		signUserMessage: signUserMessage.bind(null, fcl),
	}
}

export type { FlowNetwork, FlowCurrency, FlowTransaction, AuthWithPrivateKey } from "./types"
export type { FlowRoyalty } from "@rarible/flow-api-client"
export { toFlowItemId, isFlowItemId } from "./common/item/index"
export type { FlowItemId } from "./common/item/index"
export type { FlowContractAddress } from "./common/flow-address/index"
export { toFlowContractAddress, isFlowContractAddress } from "./common/flow-address/index"
export type { FlowEnv } from "./config/env"
export const FLOW_ENV_CONFIG: FlowEnvConfig = ENV_CONFIG
export { FlowOrder } from "@rarible/flow-api-client"
