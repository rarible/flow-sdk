import type { Fcl } from "@rarible/fcl-types"
import type { Maybe } from "@rarible/types/build/maybe"
import type { ConfigurationParameters } from "@rarible/flow-api-client"
import * as ApiClient from "@rarible/flow-api-client"
import type { FlowMintResponse } from "./nft/mint"
import { mint as mintTemplate } from "./nft/mint"
import { burn as burnTemplate } from "./nft/burn"
import { transfer as transferTemplate } from "./nft/transfer"
import { sell as sellTemplate } from "./order/sell"
import { buy as buyTemplate } from "./order/buy"
import { cancelOrder as cancelOrderTmeplate } from "./order/cancel-order"
import { signUserMessage as signUserMessageTemplate } from "./signature/sign-user-message"
import { getFungibleBalance as getFungibleBalanceTemplate } from "./wallet/get-fungible-balance"
import type { AuthWithPrivateKey, FlowCurrency, FlowNetwork, FlowRoyalty, FlowTransaction } from "./types"
import { updateOrder as updateOrderTemplate } from "./order/update-order"
import type { FlowAddress, FlowContractAddress } from "./common/flow-address"
import { CONFIGS } from "./config"

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
	 * @return token id
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
	 * @param collection
	 * @param sellItemId
	 * @param sellItemPrice
	 */
	sell(
		collection: FlowContractAddress,
		currency: FlowCurrency,
		sellItemId: number,
		sellItemPrice: string,
	): Promise<FlowTransaction>

	/**
	 * Update sell order
	 * @param collection
	 * @param currency
	 * @param orderId
	 * @param price
	 */
	updateOrder(
		collection: FlowContractAddress,
		currency: FlowCurrency,
		orderId: number,
		price: string,
	): Promise<FlowTransaction>

	/**
	 * Initiate NFT purchase
	 * @param collection
	 * @param itemId
	 * @param owner
	 */
	buy(collection: FlowContractAddress, currency: FlowCurrency, orderId: number, owner: string): Promise<FlowTransaction>

	/**
	 * Cancel sell order
	 * @param collection
	 * @param orderId
	 */
	cancelOrder(collection: FlowContractAddress, orderId: number): Promise<FlowTransaction>
}

export interface FlowWalletSdk {
	getFungibleBalance(address: FlowAddress, currency: FlowCurrency): Promise<string>
}

export interface FlowSdk {
	apis: FlowApisSdk
	nft: FlowNftSdk
	order: FlowOrderSdk
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
export function createFlowSdk(fcl: Maybe<Fcl>, network: FlowNetwork, auth?: AuthWithPrivateKey): FlowSdk {
	return {
		apis: createFlowApisSdk(network),
		nft: {
			mint: mintTemplate.bind(null, fcl, auth, network),
			burn: burnTemplate.bind(null, fcl, auth, network),
			transfer: transferTemplate.bind(null, fcl, auth, network),
		},
		order: {
			sell: sellTemplate.bind(null, fcl, auth, network),
			buy: buyTemplate.bind(null, fcl, auth, network),
			cancelOrder: cancelOrderTmeplate.bind(null, fcl, auth, network),
			updateOrder: updateOrderTemplate.bind(null, fcl, auth, network),
		},
		wallet: {
			getFungibleBalance: getFungibleBalanceTemplate.bind(null, fcl, network),
		},
		signUserMessage: signUserMessageTemplate.bind(null, fcl),
	}
}
