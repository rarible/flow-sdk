import type { FlowOrder, FlowOrderControllerApi } from "@rarible/flow-api-client"
import type { FlowOrderWithType } from "../fill/fill"
import { retry } from "../../common/retry"
import { addOrderType } from "./add-order-type"

export async function getPreparedOrder(
	orderApi: FlowOrderControllerApi, order: string | number | FlowOrder): Promise<FlowOrderWithType> {
	if (typeof order === "string" || typeof order === "number") {
		const response = await retry(10, 2000, () => orderApi.getOrderByOrderId({ orderId: order.toString() }))
		return addOrderType(response)
	}
	return addOrderType(order)
}
