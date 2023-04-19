import type { FlowOrder } from "@rarible/flow-api-client"
import type { FlowSdk } from "../../index"
import { retry } from "../../common/retry"

export function awaitOrder(sdk: FlowSdk, orderId: string | number): Promise<FlowOrder> {
	return retry(10, 2000, async () => {
		return sdk.apis.order.getOrderByOrderId({ orderId: orderId.toString() })
	})
}
