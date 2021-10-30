import { FlowTransaction } from "../index"

type EventNames =
	"Withdraw"
	| "Deposit"
	| "Mint"
	| "Destroy"
	| "ListingAvailable"
	| "OrderAvailable"
	| "ListingCompleted"
type ContractNames =
	"CommonNFT"
	| "NonFungibleToken"
	| "FungibleToken"
	| "FUSD"
	| "FlowToken"
	| "NFTStorefront"
	| "CommonOrder"
	| "MotoGPCard"
	| "Evolution"
	| "CommonFee"
	| "TopShot"
	| "CommonNFT"
	| "LicensedNFT"

export function checkEvent(txResult: FlowTransaction, eventName: EventNames, contractName?: ContractNames) {
	const result = !!txResult.events.find(e => {
		const [_, __, name, event] = e.type.split(".")
		if (contractName) {
			return name === contractName && event === eventName
		}
		return event === eventName
	})
	expect(result).toBeTruthy()
}

type FlowSimpleOrderTest = {
	orderId: number
	price: string
	collection: string
	itemId: number
	payments: any[]
}

export function getOrderFromOrderTx(tx: FlowTransaction): FlowSimpleOrderTest {
	const { orderId, price, nftType, nftId, payments } = tx.events.find(e => {
		const [_, __, ___, event] = e.type.split(".")
		return event === "OrderAvailable"
	})?.data
	if (!orderId) {
		throw Error("Invalid transaction response")
	}
	return {
		orderId,
		price,
		collection: nftType,
		itemId: nftId,
		payments,
	}
}
