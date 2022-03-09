import type { FlowNftItemControllerApi } from "@rarible/flow-api-client"
import { retry } from "../../../common/retry"
import type { FlowFee } from "../../../types"

export async function fetchItemRoyalties(
	itemApi: FlowNftItemControllerApi,
	itemId: string,
): Promise<FlowFee[]> {
	return (await retry(10, 1000, async () => itemApi.getNftItemRoyaltyById({ itemId }))).royalty
}
