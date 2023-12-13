import type { FlowRoyalty } from "@rarible/flow-api-client"
import { toBigNumberLike, toFlowAddress } from "@rarible/types"

export function validateRoyalties(royalties: FlowRoyalty[]): FlowRoyalty[] {
	if (royalties.length) {
		const result: FlowRoyalty[] = []
		royalties.forEach(r => {
			if (r.account && r.value) {
				result.push({
					account: toFlowAddress(r.account),
					value: toBigNumberLike(r.value),
				})
			} else if (!r.account && !r.value) {
				return
			} else {
				throw new Error("Invalid royalties account or value")
			}
		})
		return result
	}
	return []
}
