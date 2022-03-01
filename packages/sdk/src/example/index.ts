import * as fcl from "@onflow/fcl"
import { FLOW_ZERO_ADDRESS, toBigNumber, toFlowAddress } from "@rarible/types"
import { createFlowSdk, toFlowItemId } from "../index"
import type { FlowFee } from "../types"
import { getContractAddress } from "../config/utils"

/** Configure fcl first */
/** Learn more about fcl configuration https://docs.onflow.org/fcl/#wallet-interactions */
fcl.config()
	.put("accessNode.api", "https://access-mainnet-beta.onflow.org")
	.put("challenge.handshake", "https://flow-wallet.blocto.app/authn")

const feesArray: FlowFee[] = [{ account: FLOW_ZERO_ADDRESS, value: toBigNumber("0.1") }]

/** Create SDK */
const sdk = createFlowSdk(fcl, "mainnet")

/** Nft features: mint, burn, transfer */
const collection = getContractAddress("testnet", "RaribleNFT")

sdk.nft.mint(
	collection,
	"ipfs:ipfs://...",
	feesArray,
).then(response => {
	console.log("transaction id: ", response.txId)
	console.log("minted token id: ", response.tokenId)
})

sdk.nft.transfer(collection, 123, toFlowAddress("")).then(response => {
	console.log("transaction id: ", response.txId)
})

sdk.nft.burn(collection, 123).then(response => {
	console.log("transaction id: ", response.txId)
})

/** Order features: create, update, cancel, fill, createBid, updateBid, cancelBid, acceptBid*/
sdk.order.sell({
	collection,
	itemId: toFlowItemId(`A.${FLOW_ZERO_ADDRESS}.RaribleNFT:123`),
	originFees: feesArray,
	sellItemPrice: toBigNumber("0.3"),
	currency: "FLOW",
}).then(response => {
	console.log("order id: ", response.orderId)
})

sdk.order.updateOrder({
	collection,
	currency: "FUSD",
	order: 123,
	sellItemPrice: toBigNumber("0.1"),
}).then(response => {
	console.log("order id: ", response.orderId)
})

sdk.order.cancelOrder(collection, 123).then(response => {
	console.log("transaction id: ", response.txId)
})

sdk.order.bid(collection, "FLOW", toFlowItemId("flow item id"), toBigNumber("0.1")).then(response => {
	console.log("bid order id: ", response.orderId)
})

sdk.order.bidUpdate(collection, "FLOW", 123, toBigNumber("0.1")).then(response => {
	console.log("bid order id: ", response.orderId)
})

sdk.order.cancelBid(collection, 123).then(response => {
	console.log("transaction id: ", response.txId)
})

// fill order function can close both order types, sell and bid
sdk.order.fill(collection, "FLOW", 123, FLOW_ZERO_ADDRESS, feesArray).then(response => {
	console.log("transaction id: ", response.txId)
})

/** get fungible balance feature*/
sdk.wallet.getFungibleBalance(FLOW_ZERO_ADDRESS, "FUSD").then(balance => {
	console.log("balance: ", balance)
})
