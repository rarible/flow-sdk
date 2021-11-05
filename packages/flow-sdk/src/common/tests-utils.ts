import type { FlowTransaction } from "../index"

type EventNames =
	"Withdraw"
	| "Deposit"
	| "Mint"
	| "Destroy"
	| "ListingAvailable"
	| "OrderAvailable"
	| "ListingCompleted"
type ContractNames =
	"NonFungibleToken"
	| "FungibleToken"
	| "FUSD"
	| "FlowToken"
	| "NFTStorefront"
	| "RaribleOrder"
	| "MotoGPCard"
	| "Evolution"
	| "RaribleFee"
	| "TopShot"
	| "RaribleNFT"
	| "LicensedNFT"

export function checkEvent(txResult: FlowTransaction, eventName: EventNames, contractName?: ContractNames) {
	const result = !!txResult.events.find(e => {
		const [, , name, event] = e.type.split(".")
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
	const event = tx.events.find(e => e.type.split(".")[3] === "OrderAvailable")
	if (event && isObject(event.data)) {
		const { orderId, price, nftType, nftId, payments } = event.data
		if (!orderId) {
			throw new Error("Invalid transaction response")
		}
		return {
			orderId,
			price,
			collection: nftType,
			itemId: nftId,
			payments,
		}
	}
	throw new Error("Event not found - OrderAvailable")
}

function isObject(x: unknown): x is Object {
	return typeof x === "object" && x !== null
}