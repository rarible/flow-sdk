import { toBn } from "@rarible/utils"
import type { FlowAddress } from "@rarible/types"
import { toBigNumber } from "@rarible/types"
import type { FlowFee } from "../../types"

export function calculateSaleCuts(mainPayoutAddress: FlowAddress, price: string, fees: FlowFee[]): FlowFee[] {
	const startPrice = toBn(price)
	let mainPayout = toBn(price)
	const resultSaleCuts: FlowFee[] = fees.map(fee => {
		const value = startPrice.multipliedBy(toBn(fee.value))
		mainPayout = mainPayout.minus(value)
		return {
			...fee,
			value: toBigNumber(value.decimalPlaces(8).toString()),
		}
	})
	if (mainPayout.gt(0)) {
		resultSaleCuts.push({ account: mainPayoutAddress, value: toBigNumber(mainPayout.decimalPlaces(8).toString()) })
	} else if (mainPayout.lt(0)) {
		throw new Error("Sum of payouts greater than price")
	}
	return resultSaleCuts
}
