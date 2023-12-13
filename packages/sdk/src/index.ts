import type { Fcl } from "@rarible/fcl-types"
import type { Maybe } from "@rarible/types"
import type { ConfigurationParameters, FlowOrder, FlowRoyalty } from "@rarible/flow-api-client"
import * as ApiClient from "@rarible/flow-api-client"
import type { BigNumberLike, FlowAddress, FlowContractAddress } from "@rarible/types"
import type { FlowMintResponse } from "./nft/mint"
import { mint as mintTemplate } from "./nft/mint"
import { burn as burnTemplate } from "./nft/burn"
import { transfer as transferTemplate } from "./nft/transfer"
import type { FlowSellRequest, FlowSellResponse } from "./order/sell"
import { sell as sellTemplate } from "./order/sell"
import { fill as buyTemplate } from "./order/fill/fill"
import { cancelOrder as cancelOrderTmeplate } from "./order/cancel-order"
import { signUserMessage as signUserMessageTemplate } from "./signature/sign-user-message"
import { getFungibleBalance as getFungibleBalanceTemplate } from "./wallet/get-fungible-balance"
import { bid as bidTemplate } from "./order/bid"
import { bidUpdate as bidUpdateTemplate } from "./order/bid-update"
import { cancelBid as cancelBidTmeplate } from "./order/cancel-bid"
import {setupAccount as setupAccountTemplate, setupVault} from "./collection/setup-account"
import type { ProtocolFees } from "./order/get-protocol-fee"
import { getProtocolFee as getProtocolFeeUpdateTemplate } from "./order/get-protocol-fee"
import type { AuthWithPrivateKey, FlowCurrency, FlowEnv, FlowOriginFees, FlowTransaction } from "./types"
import type { FlowUpdateOrderRequest } from "./order/update-order"
import { updateOrder as updateOrderTemplate } from "./order/update-order"
import type { FlowItemId } from "./common/item"
import type { FlowEnvConfig } from "./config/env"
import { ENV_CONFIG } from "./config/env"
import type { TransferFlowRequest } from "./wallet/transfer-funds"
import { transferFunds } from "./wallet/transfer-funds"
import type {CollectionsInitStatus} from "./collection/check-init-collections"
import {setupCollections} from "./collection/setup-collections"
import {checkInitCollections} from "./collection/check-init-collections"

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
		orderId: string | number | FlowOrder,
		owner: string,
		fees: FlowOriginFees,
	): Promise<FlowTransaction>

	/**
	 * Cancel sell order
	 * @param collection
	 * @param orderId
	 */
	cancelOrder(collection: FlowContractAddress, orderId: string | number): Promise<FlowTransaction>

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
		price: BigNumberLike,
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
		order: string | number | FlowOrder,
		price: BigNumberLike,
	): Promise<FlowSellResponse>

	/**
	 * Cancel sell order
	 * @param collection
	 * @param orderId
	 */
	cancelBid(collection: FlowContractAddress, orderId: number | string): Promise<FlowTransaction>

	getProtocolFee(): ProtocolFees
}

export interface FlowWalletSdk {
	getFungibleBalance(address: FlowAddress, currency: FlowCurrency): Promise<string>
	transferFunds(request: TransferFlowRequest): Promise<FlowTransaction>
	setupVault(): Promise<FlowTransaction>
}

export interface FlowCollectionSdk {
	setupAccount(collection: FlowContractAddress): Promise<FlowTransaction>
	setupCollections(): Promise<FlowTransaction>
	checkInitCollections(address?: FlowAddress): Promise<CollectionsInitStatus>
}

export interface FlowSdk {
	apis: FlowApisSdk
	nft: FlowNftSdk
	order: FlowOrderSdk
	collection: FlowCollectionSdk
	wallet: FlowWalletSdk

	signUserMessage(message: string): Promise<string>
}

export function createFlowApisSdk(
	env: FlowEnv,
	params: ConfigurationParameters = {},
): FlowApisSdk {
	const configuration = new ApiClient.Configuration({
		basePath: ENV_CONFIG[env].basePath,
		headers: typeof params.apiKey === "string" ? { "X-API-KEY": params.apiKey } : {},
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
			mint: mintTemplate.bind(null, fcl, auth, blockchainNetwork),
			burn: burnTemplate.bind(null, fcl, auth, blockchainNetwork),
			transfer: transferTemplate.bind(null, fcl, auth, blockchainNetwork),
		},
		order: {
			sell: sellTemplate.bind(null, fcl, apis.item, auth, blockchainNetwork),
			fill: buyTemplate.bind(null, fcl, auth, blockchainNetwork, apis.order).bind(null, apis.item),
			cancelOrder: cancelOrderTmeplate.bind(null, fcl, auth, blockchainNetwork),
			updateOrder: updateOrderTemplate.bind(
				null, fcl, apis.order, auth).bind(null, blockchainNetwork,
			),
			bid: bidTemplate.bind(null, fcl, auth, blockchainNetwork),
			bidUpdate: bidUpdateTemplate.bind(null, fcl, auth, blockchainNetwork, apis.order),
			cancelBid: cancelBidTmeplate.bind(null, fcl, auth, blockchainNetwork),
			getProtocolFee: getProtocolFeeUpdateTemplate.bind(null, blockchainNetwork),
		},
		wallet: {
			getFungibleBalance: getFungibleBalanceTemplate.bind(null, fcl, blockchainNetwork),
			transferFunds: transferFunds.bind(null, fcl, blockchainNetwork, auth),
			setupVault: setupVault.bind(null, fcl, auth, blockchainNetwork),
		},
		collection: {
			setupAccount: setupAccountTemplate.bind(null, fcl, auth, blockchainNetwork),
			setupCollections: setupCollections.bind(null, fcl, auth, blockchainNetwork),
			checkInitCollections: checkInitCollections.bind(null, fcl, auth, blockchainNetwork),
		},
		signUserMessage: signUserMessageTemplate.bind(null, fcl),
	}
}

export type { FlowNetwork, FlowCurrency, FlowTransaction, AuthWithPrivateKey } from "./types"
export type { FlowRoyalty } from "@rarible/flow-api-client"
export { toFlowItemId, isFlowItemId } from "./common/item/index"
export type { FlowItemId } from "./common/item/index"
export type { FlowEnv } from "./config/env"
export const FLOW_ENV_CONFIG: FlowEnvConfig = ENV_CONFIG
export { FlowOrder } from "@rarible/flow-api-client"
export { getFungibleBalanceSimple } from "./wallet/get-ft-balance-simple"
export const getFlowFungibleBalance = getFungibleBalanceTemplate
