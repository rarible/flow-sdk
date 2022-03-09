import { fixAmount } from "../../../common/fix-amount"
import type { FlowFee } from "../../../types"

type EnglishAuctionFeePart = {
	fields: [
		{ name: "address", value: string },
		{ name: "rate", value: string },
	]
}

export function convertToAuctionParts(fees: FlowFee[]): EnglishAuctionFeePart[] {
	let parts: EnglishAuctionFeePart[] = []
	fees.forEach(f => {
		if (fixAmount(f.value) !== "0.0") {
			parts.push({
				fields: [
					{ name: "address", value: f.account },
					{ name: "rate", value: fixAmount(f.value) },
				],
			})
		}
	})
	return parts
}
