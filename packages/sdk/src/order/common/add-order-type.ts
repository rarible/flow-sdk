import type { FlowOrder } from "@rarible/flow-api-client"
import type { FlowOrderWithType } from "../fill/fill"

export function addOrderType(order: FlowOrder): FlowOrderWithType {
	const { make, take } = order
	if (take["@type"] === "fungible") {
		return { ...order, type: "LIST" }
	} else if (make["@type"] === "fungible") {
		return { ...order, type: "BID" }
	}
	throw new Error(`Invalid order. Can't find fungible asset in make and take fields. make asset type is: ${make["@type"]}, take asset type is ${take["@type"]}`)
}
