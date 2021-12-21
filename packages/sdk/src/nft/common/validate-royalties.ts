import type { FlowRoyalty } from "@rarible/flow-api-client"
import { toBigNumber, toFlowAddress } from "@rarible/types"

export function validateRoyalties(royalties: FlowRoyalty[]): FlowRoyalty[] {
	if (royalties.length) {
		return royalties.map(r => {
			if (r.account) {
				if (r.value) {
					return {
						account: toFlowAddress(r.account),
						value: toBigNumber(r.value),
					}
				}
				throw new Error("Undefined royalties value")
			}
			throw new Error("Invalid account address for royalties")
		})
	}
	return []
}
