import type { FlowRoyalty } from "@rarible/flow-api-client"

export function convertRoyalties(royalties: FlowRoyalty[]) {
	return royalties.map(royalty => ({
		fields: [
			{ name: "address", value: royalty.account },
			{ name: "fee", value: royalty.value },
		],
	}))
}
