import { CONFIGS, Networks, Royalty, TxResult } from "@rarible/flow-sdk-scripts"
import { mint as mintTemplate } from "./nft/mint"
import { burn as burnTemplate } from "./nft/burn"
import { transfer as transferTemplate } from "./nft/transfer"
import { sell as sellTemplate } from "./order/sell"
import { buy as buyTemplate } from "./order/buy"
import { cancelOrder as cancelOrderTmeplate } from "./order/cancel-order"
import { signUserMessage as signUserMessageTemplate } from "./signature/sign-user-message"
import type { Fcl } from "./fcl"

export interface FlowNftSdk {
	/**
	 *
	 * @param collection
	 * @param metadata
	 * @param royalties
	 * @return token id
	 */
	mint(collection: string, metadata: string, royalties: Royalty[]): Promise<number>

	/**
	 *
	 * @param collection
	 * @param tokenId
	 * @param to
	 */
	transfer(collection: string, tokenId: number, to: string): Promise<TxResult>

	/**
	 *
	 * @param collection
	 * @param tokenId
	 */
	burn(collection: string, tokenId: number): Promise<TxResult>
}

export interface FlowOrderSdk {
	/**
	 *
	 * @param collection
	 * @param sellItemId
	 * @param sellItemPrice
	 */
	sell(collection: string, sellItemId: number, sellItemPrice: string): Promise<TxResult>

	/**
	 *
	 * @param collection
	 * @param itemId
	 * @param owner
	 */
	buy(collection: string, itemId: number, owner: string): Promise<TxResult>

	/**
	 *
	 * @param collection
	 * @param orderId
	 */
	cancelOrder(collection: string, orderId: number): Promise<TxResult>
}

export interface FlowSdk {
	nft: FlowNftSdk,
	order: FlowOrderSdk,

	signUserMessage(message: string): Promise<string>
}

// todo may be add config param for wallet discovery
export function createFlowSdk(fcl: Fcl, network: Networks): FlowSdk {
	fcl.config()
		.put("accessNode.api", CONFIGS[network].accessNode)
		.put("challenge.handshake", CONFIGS[network].challengeHandshake)

	const mint = mintTemplate.bind(null, network)
	const transfer = transferTemplate.bind(null, network)
	const burn = burnTemplate.bind(null, network)

	const sell = sellTemplate.bind(null, network)
	const buy = buyTemplate.bind(null, network)
	const cancelOrder = cancelOrderTmeplate.bind(null, network)

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
		},
		signUserMessage,
	}
}
