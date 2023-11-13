import type {FlowOrder} from "@rarible/flow-api-client"

export function getOrderId(order: string | number | FlowOrder): number {
	if (typeof order === "number") {
		return order
	}
	if (typeof order === "string") {
		return parseInt(order)
	}
	return parseInt(order.id)
}
