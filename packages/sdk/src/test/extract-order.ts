import type { FlowTransaction } from "../types"

type FlowSimpleOrderTest = {
	orderId: number
	price: string
	collection: string
	itemId: number
	payments: any[]
	vaultType: string
}

export function extractOrder(tx: FlowTransaction): FlowSimpleOrderTest {
	const event = tx.events.find(e => e.type.split(".")[3] === "OrderAvailable")
	if (event && isObject(event.data)) {
		const { orderId, price, nftType, nftId, payments, vaultType } = event.data
		if (!orderId) {
			throw new Error("Invalid transaction response")
		}
		return {
			orderId,
			price,
			collection: nftType,
			itemId: nftId,
			payments,
			vaultType: vaultType.split(".")[2],
		}
	}
	throw new Error("Event not found - OrderAvailable")
}

function isObject(x: unknown): x is Object {
	return typeof x === "object" && x !== null
}
