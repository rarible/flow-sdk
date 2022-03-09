import type { FlowRoyalty } from "@rarible/flow-api-client"
import { fixAmount } from "../../common/fix-amount"

type TxRoyaltyType = {
	fields: { name: string, value: string }[]
}

export function convertRoyalties(royalties: FlowRoyalty[]): TxRoyaltyType[] {
	let result: TxRoyaltyType[] = []
	royalties.forEach(royalty => {
		if (royalty.value && royalty.account) {
			result.push({
				fields: [
					{ name: "address", value: royalty.account },
					{ name: "fee", value: fixAmount(royalty.value) },
				],
			})
		} else if (!royalty.value.length) {
			throw new Error("Royalties: value is undefined")
		} else if (!royalty.account.length) {
			throw new Error("Royalties: account is undefined")
		}
	})
	return result
}
