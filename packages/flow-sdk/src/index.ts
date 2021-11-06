import type { Fcl } from "@rarible/fcl-types"
import type { FlowMintResponse} from "./nft/mint"
import { mint as mintTemplate } from "./nft/mint"
import { burn as burnTemplate } from "./nft/burn"
import { transfer as transferTemplate } from "./nft/transfer"
import { sell as sellTemplate } from "./order/sell"
import { buy as buyTemplate } from "./order/buy"
import { cancelOrder as cancelOrderTmeplate } from "./order/cancel-order"
import { signUserMessage as signUserMessageTemplate } from "./signature/sign-user-message"
import { getFungibleBalance as getFungibleBalanceTemplate } from "./wallet/get-fungible-balance"
import type { FlowNetwork, FlowTransaction } from "./types"
import type { AuthWithPrivateKey, FlowCurrency, FlowRoyalty } from "./types"
import { updateOrder as updateOrderTemplate } from "./order/update-order"

export interface FlowNftSdk {
	/**
	 *
	 * @param collection
	 * @param metadata
	 * @param royalties
	 * @return token id
	 */
	mint(collection: string, metadata: string, royalties: FlowRoyalty[]): Promise<FlowMintResponse>

	/**
	 *
	 * @param collection
	 * @param tokenId
	 * @param to
	 */
	transfer(collection: string, tokenId: number, to: string): Promise<FlowTransaction>

	/**
	 *
	 * @param collection
	 * @param tokenId
	 */
	burn(collection: string, tokenId: number): Promise<FlowTransaction>
}

export interface FlowOrderSdk {
	/**
	 *
	 * @param collection
	 * @param sellItemId
	 * @param sellItemPrice
	 */
	sell(collection: string, currency: FlowCurrency, sellItemId: number, sellItemPrice: string): Promise<FlowTransaction>

	/**
	 * Update sell order
	 * @param collection
	 * @param currency
	 * @param orderId
	 * @param price
	 */
	updateOrder(collection: string, currency: FlowCurrency, orderId: number, price: string): Promise<FlowTransaction>

	/**
	 *
	 * @param collection
	 * @param itemId
	 * @param owner
	 */
	buy(collection: string, currency: FlowCurrency, orderId: number, owner: string): Promise<FlowTransaction>

	/**
	 *
	 * @param collection
	 * @param orderId
	 */
	cancelOrder(collection: string, orderId: number): Promise<FlowTransaction>
}

export interface FlowWalletSdk {
	getFungibleBalance(address: string, currency: FlowCurrency): Promise<string>
}

export interface FlowSdk {
	nft: FlowNftSdk,
	order: FlowOrderSdk,
	wallet: FlowWalletSdk

	signUserMessage(message: string): Promise<string>
}


// todo may be add config param for wallet discovery
/**
 *
 * @param fcl
 * @param network
 * @param auth  - optional, only for testing purposes
 */
export function createFlowSdk(fcl: Fcl, network: FlowNetwork, auth?: AuthWithPrivateKey): FlowSdk {

	const mint = mintTemplate.bind(null, fcl, auth, network)
	const transfer = transferTemplate.bind(null, fcl, auth, network)
	const burn = burnTemplate.bind(null, fcl, auth, network)

	const sell = sellTemplate.bind(null, fcl, auth, network)
	const buy = buyTemplate.bind(null, fcl, auth, network)
	const cancelOrder = cancelOrderTmeplate.bind(null, fcl, auth, network)
	const updateOrder = updateOrderTemplate.bind(null, fcl, auth, network)

	const getFungibleBalance = getFungibleBalanceTemplate.bind(null, fcl, network)

	const signUserMessage = signUserMessageTemplate.bind(null, fcl)

	return {
		nft: {
			mint,
			burn,
			transfer,
		},
		order: {
			sell,
			buy,
			cancelOrder,
			updateOrder,
		},
		wallet: {
			getFungibleBalance,
		},
		signUserMessage,
	}
}
