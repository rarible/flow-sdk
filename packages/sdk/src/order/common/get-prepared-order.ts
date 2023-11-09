import type { FlowOrder, FlowOrderControllerApi } from "@rarible/flow-api-client"
import type { FlowOrderWithType } from "../fill/fill"
import { retry } from "../../common/retry"
import { addOrderType } from "./add-order-type"

export async function getPreparedOrder(
	orderApi: FlowOrderControllerApi, order: string | FlowOrder): Promise<FlowOrderWithType> {
	if (typeof order === "string") {
		const response = await retry(10, 2000, () => orderApi.getOrderByOrderId({ orderId: order.toString() }))
		return addOrderType(response)
	}
	return addOrderType(order)
}
