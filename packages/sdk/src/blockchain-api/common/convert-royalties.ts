import type { FlowRoyalty } from "@rarible/flow-api-client"
import { fixAmount } from "../../common/fix-amount"

export function convertRoyalties(royalties: FlowRoyalty[]) {
	return royalties.map(royalty => ({
		fields: [
			{ name: "address", value: royalty.account },
			{ name: "fee", value: fixAmount(royalty.value) },
		],
	}))
}
