import { Royalty } from "@rarible/flow-sdk-scripts"
import { config } from "@onflow/fcl"
import { mint as mintTemplate } from "./nft/mint"
import { burn as burnTemplate } from "./nft/burn"
import { transfer as transferTemplate } from "./nft/transfer"
import { sell as sellTemplate } from "./order/sell"
import { buy as buyTemplate } from "./order/buy"
import { cancelOrder as cancelOrderTmeplate } from "./order/cancel-order"
import { CONFIGS, Networks } from "./config"
import { signUserMessage } from "./utils/sign-user-message"

export type FlowNftSdk = {
	mint(collection: string, metadata: string, royalties: Royalty[]): Promise<string>
	transfer(collection: string, tokenId: number, to: string): Promise<string>
	burn(collection: string, tokenId: number): Promise<string>
}

export type FlowOrderSdk = {
	sell(collection: string, sellItemId: number, sellItemPrice: string): Promise<string>
	buy(collection: string, itemId: number, owner: string): Promise<string>
	cancelOrder(collection: string, orderId: number): Promise<string>
}

type FlowSdk = {
	nft: FlowNftSdk,
	order: FlowOrderSdk,
	signUserMessage(message: string): Promise<string>
}

export function createFlowSdk(network: Networks): FlowSdk {
	config()
		.put("accessNode.api", CONFIGS[network].accessNode)
		.put("challenge.handshake", "https://fcl-discovery.onflow.org/testnet/authn")// todo set based on network value

	const mint = mintTemplate.bind(null, network)
	const transfer = transferTemplate.bind(null, network)
	const burn = burnTemplate.bind(null, network)

	const sell = sellTemplate.bind(null, network)
	const buy = buyTemplate.bind(null, network)
	const cancelOrder = cancelOrderTmeplate.bind(null, network)

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
