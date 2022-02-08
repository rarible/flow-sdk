import type { Fcl } from "@rarible/fcl-types"
import type { Maybe } from "@rarible/types/build/maybe"
import type { ConfigurationParameters, FlowOrder, FlowRoyalty } from "@rarible/flow-api-client"
import * as ApiClient from "@rarible/flow-api-client"
import type { BigNumber, FlowAddress } from "@rarible/types"
import type { FlowMintResponse } from "./interfaces/nft/mint"
import { mint as mintTemplate } from "./interfaces/nft/mint"
import { burn as burnTemplate } from "./interfaces/nft/burn"
import { transfer as transferTemplate } from "./interfaces/nft/transfer"
import type { FlowSellRequest, FlowSellResponse } from "./interfaces/order/sell"
import { sell as sellTemplate } from "./interfaces/order/sell"
import { fill as buyTemplate } from "./interfaces/order/fill/fill"
import { cancelOrder as cancelOrderTmeplate } from "./interfaces/order/cancel-order"
import { signUserMessage as signUserMessageTemplate } from "./interfaces/signature/sign-user-message"
import { getFungibleBalance as getFungibleBalanceTemplate } from "./interfaces/wallet/get-fungible-balance"
import { bid as bidTemplate } from "./interfaces/order/bid"
import { bidUpdate as bidUpdateTemplate } from "./interfaces/order/bid-update"
import { cancelBid as cancelBidTmeplate } from "./interfaces/order/cancel-bid"
import { setupAccount as setupAccountTemplate } from "./interfaces/collection/setup-account"
import type { CreateCollectionRequest, CreateCollectionResponse } from "./interfaces/collection/create-collection"
import { createCollection as createCollectionTemplate } from "./interfaces/collection/create-collection"
import type { ProtocolFees } from "./interfaces/order/get-protocol-fee"
import { getProtocolFee as getProtocolFeeUpdateTemplate } from "./interfaces/order/get-protocol-fee"
import type { AuthWithPrivateKey, FlowCurrency, FlowEnv, FlowOriginFees, FlowTransaction } from "./types/types"
import type { FlowUpdateOrderRequest } from "./interfaces/order/update-order"
import { updateOrder as updateOrderTemplate } from "./interfaces/order/update-order"
import type { FlowItemId } from "./types/item"
import { FLOW_ENV_CONFIG } from "./config/env"
import type { FlowContractAddress } from "./types/contract-address"
import type { UpdateCollectionRequest, UpdateCollectionResponse } from "./interfaces/collection/update-collection"
import { updateCollection as updateCollectionTemplate } from "./interfaces/collection/update-collection"

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

export interface FlowWalletSdk {
	getFungibleBalance(address: FlowAddress, currency: FlowCurrency): Promise<string>
}

export interface FlowCollectionSdk {
	setupAccount(collection: FlowContractAddress): Promise<FlowTransaction>

	/**
	 * Create a new User collection
	 *
	 * @returns FlowTransaction + <b>collectionId</> (minterId) and <b>parentId</b>(parent minterId)
	 * @param request
	 *
	 *  <p> {</p>
	 *  	<p> collection?: FlowContractAddress </p>
	 *		<p>receiver: FlowAddress</p>
	 *		<p>name: string</p>
	 *		<p>symbol: string</p>
	 *		<p>royalties: FlowFee[]</p>
	 *		<p>icon?: string</p>
	 *		<p>description?: string</p>
	 *		<p>url?: string</p>
	 *		<p>supply?: number</p>
	 *<p>}</p>
	 */
	createCollection(request: CreateCollectionRequest): Promise<CreateCollectionResponse>

	updateCollection(request: UpdateCollectionRequest): Promise<UpdateCollectionResponse>
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
		basePath: FLOW_ENV_CONFIG[env].basePath,
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
	const blockchainNetwork = FLOW_ENV_CONFIG[network].network
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
		},
		collection: {
			setupAccount: setupAccountTemplate.bind(null, fcl, auth, blockchainNetwork),
			createCollection: createCollectionTemplate.bind(null, fcl, auth, blockchainNetwork),
			updateCollection: updateCollectionTemplate.bind(null, fcl, auth, blockchainNetwork),
		},
		signUserMessage: signUserMessageTemplate.bind(null, fcl),
	}
}

export type {
	FlowNetwork,
	FlowCurrency,
	FlowTransaction,
	AuthWithPrivateKey,
	FlowFee,
	FlowEnv,
	NonFungibleContract,
} from "./types/types"
export { NON_FUNGIBLE_CONTRACTS } from "./types/types"
export type { FlowRoyalty } from "@rarible/flow-api-client"
export { toFlowItemId, isFlowItemId } from "./types/item/index"
export type { FlowItemId } from "./types/item/index"
export type { FlowContractAddress } from "./types/contract-address/index"
export { toFlowContractAddress, isFlowContractAddress } from "./types/contract-address/index"
export { FLOW_ENV_CONFIG } from "./config/env"
export { FlowOrder } from "@rarible/flow-api-client"
