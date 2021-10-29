import { Royalty } from "@rarible/flow-sdk-scripts/src"

export const convertRoyalties = (royalties: Royalty[]) =>
	royalties.map(royalty => ({
		fields: [
			{ name: "address", value: royalty.account },
			{ name: "fee", value: royalty.value },
		],
	}))
