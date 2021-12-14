import type { Fcl } from "@rarible/fcl-types"
import type { Maybe } from "@rarible/types/build/maybe"
import type { ConfigurationParameters, FlowOrder, FlowRoyalty } from "@rarible/flow-api-client"
import * as ApiClient from "@rarible/flow-api-client"
import type { BigNumber, FlowAddress } from "@rarible/types"
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
import { setupAccount as setupAccountTemplate } from "./collection/setup-account"
import type { ProtocolFees } from "./order/get-protocol-fee"
import { getProtocolFee as getProtocolFeeUpdateTemplate } from "./order/get-protocol-fee"
import type { AuthWithPrivateKey, FlowCurrency, FlowNetwork, FlowOriginFees, FlowTransaction } from "./types"
import type { FlowUpdateOrderRequest } from "./order/update-order"
import { updateOrder as updateOrderTemplate } from "./order/update-order"
import { CONFIGS } from "./config/config"
import type { FlowItemId } from "./common/item"
import type { FlowContractAddress } from "./common/flow-address/index"

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
	cancelOrder(collection: FlowContractAddress, orderId: number | FlowOrder): Promise<FlowTransaction>

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

	getProtocolFee(): ProtocolFees
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

	signUserMessage(message: string): Promise<string>
}

export function createFlowApisSdk(
	env: FlowNetwork,
	params: ConfigurationParameters = {},
): FlowApisSdk {
	const config = CONFIGS[env]
	const configuration = new ApiClient.Configuration({
		basePath: config.flowApiBasePath,
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
 * @param auth - optional, only for testing purposes
 */
export function createFlowSdk(
	fcl: Maybe<Fcl>,
	network: FlowNetwork,
	params?: ConfigurationParameters,
	auth?: AuthWithPrivateKey,
): FlowSdk {
	const apis = createFlowApisSdk(network, params)
	return {
		apis,
		nft: {
			mint: mintTemplate.bind(null, fcl, auth, network),
			burn: burnTemplate.bind(null, fcl, auth, network),
			transfer: transferTemplate.bind(null, fcl, auth, network),
		},
		order: {
			sell: sellTemplate.bind(null, fcl, apis.item, auth, network),
			fill: buyTemplate.bind(null, fcl, auth, network, apis.order).bind(null, apis.item),
			cancelOrder: cancelOrderTmeplate.bind(null, fcl, auth, network, apis.order),
			updateOrder: updateOrderTemplate.bind(null, fcl, apis.item, apis.order, auth).bind(null, network),
			bid: bidTemplate.bind(null, fcl, auth, network),
			bidUpdate: bidUpdateTemplate.bind(null, fcl, auth, network, apis.order),
			getProtocolFee: getProtocolFeeUpdateTemplate.bind(null, network),
		},
		wallet: {
			getFungibleBalance: getFungibleBalanceTemplate.bind(null, fcl, network),
		},
		collection: {
			setupAccount: setupAccountTemplate.bind(null, fcl, auth, network),
		},
		signUserMessage: signUserMessageTemplate.bind(null, fcl),
	}
}

export type { FlowNetwork, FlowCurrency, FlowTransaction, AuthWithPrivateKey } from "./types"
export type { FlowRoyalty } from "@rarible/flow-api-client"
export { toFlowItemId, isFlowItemId } from "./common/item/index"
export type { FlowItemId } from "./common/item/index"
export type { FlowContractAddress } from "./common/flow-address/index"
export { toFlowContractAddress, isFlowContractAddress } from "./common/flow-address/index"
