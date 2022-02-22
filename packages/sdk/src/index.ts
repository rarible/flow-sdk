import type { Fcl } from "@rarible/fcl-types"
import type { Maybe } from "@rarible/types/build/maybe"
import type { ConfigurationParameters, FlowOrder, FlowRoyalty } from "@rarible/flow-api-client"
import * as ApiClient from "@rarible/flow-api-client"
import type { BigNumber, FlowAddress } from "@rarible/types"
import type { FlowMintResponse } from "./interfaces/nft/mint"
import { mint } from "./interfaces/nft/mint"
import { burn } from "./interfaces/nft/burn"
import { transfer as transferTemplate } from "./interfaces/nft/transfer"
import type { FlowSellRequest, FlowSellResponse } from "./interfaces/order/sell"
import { sell } from "./interfaces/order/sell"
import { fill } from "./interfaces/order/fill/fill"
import { cancelOrder } from "./interfaces/order/cancel-order"
import { signUserMessage } from "./interfaces/signature/sign-user-message"
import { getFungibleBalance } from "./interfaces/wallet/get-fungible-balance"
import { bid } from "./interfaces/order/bid"
import { bidUpdate } from "./interfaces/order/bid-update"
import { cancelBid } from "./interfaces/order/cancel-bid"
import { setupAccount } from "./interfaces/collection/setup-account"
import type { CreateCollectionRequest, CreateCollectionResponse } from "./interfaces/collection/create-collection"
import { createCollection } from "./interfaces/collection/create-collection"
import type { ProtocolFees } from "./interfaces/order/get-protocol-fee"
import { getProtocolFee } from "./interfaces/order/get-protocol-fee"
import type { AuthWithPrivateKey, FlowCurrency, FlowEnv, FlowOriginFees, FlowTransaction } from "./types"
import type { FlowUpdateOrderRequest } from "./interfaces/order/update-order"
import { updateOrder } from "./interfaces/order/update-order"
import type { FlowItemId } from "./types/item"
import { FLOW_ENV_CONFIG } from "./config/env"
import type { FlowContractAddress } from "./types/contract-address"
import type { UpdateCollectionRequest, UpdateCollectionResponse } from "./interfaces/collection/update-collection"
import { updateCollection } from "./interfaces/collection/update-collection"
import { createEnglishAuction } from "./interfaces/auction/auction-create"
import { cancelEnglishAuction } from "./interfaces/auction/auction-cancel"
import { completeEnglishAuction } from "./interfaces/auction/auction-complete"
import { createBid } from "./interfaces/auction/bid-create"
import { increaseBid } from "./interfaces/auction/bid-increase"
import type {
	EnglishAuctionCancelRequest,
	EnglishAuctionCompleteRequest,
	EnglishAuctionCreateBidRequest,
	EnglishAuctionCreateRequest,
	EnglishAuctionIncreaseBidRequest,
	FlowEnglishAuctionTransaction,
} from "./interfaces/auction/domain"
import { getFrom } from "./interfaces/wallet/get-from"

export interface FlowApisSdk {
	order: ApiClient.FlowOrderControllerApi
	collection: ApiClient.FlowNftCollectionControllerApi
	item: ApiClient.FlowNftItemControllerApi
	ownership: ApiClient.FlowNftOwnershipControllerApi
	auction: ApiClient.FlowAuctionControllerApi
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
	createLot(request: EnglishAuctionCreateRequest): Promise<FlowEnglishAuctionTransaction>

	cancelLot(request: EnglishAuctionCancelRequest): Promise<FlowTransaction>

	completeLot(request: EnglishAuctionCompleteRequest): Promise<FlowTransaction>

	createBid(request: EnglishAuctionCreateBidRequest): Promise<FlowTransaction>

	increaseBid(request: EnglishAuctionIncreaseBidRequest): Promise<FlowTransaction>
}

export interface FlowWalletSdk {
	getFungibleBalance(address: FlowAddress, currency: FlowCurrency): Promise<string>

	getFrom(): Promise<FlowAddress>
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
	auction: FlowEnglishAuctionSdk

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
		auction: new ApiClient.FlowAuctionControllerApi(configuration),
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
			cancelLot: cancelEnglishAuction.bind(null, fcl, auth, blockchainNetwork),
			completeLot: completeEnglishAuction.bind(null, fcl, auth, blockchainNetwork),
			createBid: createBid.bind(null, fcl, auth, blockchainNetwork),
			increaseBid: increaseBid.bind(null, fcl, auth, blockchainNetwork),
		},
		wallet: {
			getFungibleBalance: getFungibleBalance.bind(null, fcl, blockchainNetwork),
			getFrom: getFrom.bind(null, fcl, auth),
		},
		collection: {
			createCollection: createCollection.bind(null, fcl, auth, blockchainNetwork),
			updateCollection: updateCollection.bind(null, fcl, auth, blockchainNetwork),
			setupAccount: setupAccount.bind(null, fcl, auth, blockchainNetwork),
		},
		signUserMessage: signUserMessage.bind(null, fcl),
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
} from "./types"
export { NON_FUNGIBLE_CONTRACTS } from "./types"
export type { FlowRoyalty } from "@rarible/flow-api-client"
export { toFlowItemId, isFlowItemId } from "./types/item/index"
export type { FlowItemId } from "./types/item/index"
export type { FlowContractAddress } from "./types/contract-address/index"
export { toFlowContractAddress, isFlowContractAddress } from "./types/contract-address/index"
export { FLOW_ENV_CONFIG } from "./config/env"
export { FlowOrder } from "@rarible/flow-api-client"
