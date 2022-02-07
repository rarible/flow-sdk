import type { FlowOrder, FlowOrderControllerApi } from "@rarible/flow-api-client"
import type { FlowOrderWithType } from "../fill/fill"
import { addOrderType } from "./add-order-type"

export async function getPreparedOrder(
	orderApi: FlowOrderControllerApi, order: number | FlowOrder): Promise<FlowOrderWithType> {
	if (typeof order === "number") {
		const response = await orderApi.getOrderByOrderId({ orderId: order.toString() })
		return addOrderType(response)
	}
	return addOrderType(order)
}
