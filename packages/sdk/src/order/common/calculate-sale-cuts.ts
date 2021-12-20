import { toBn } from "@rarible/utils"
import type { FlowAddress } from "@rarible/types"
import { toBigNumber, toFlowAddress } from "@rarible/types"
import type { FlowFee } from "../../types"
import { withPrefix } from "../../common/prefix"

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
	return concatNonUniqueFees(resultSaleCuts)
}

export function concatNonUniqueFees(fees: FlowFee[]): FlowFee[] {
	let unique: Record<string, string> = {}
	fees.forEach(f => {
		const account = withPrefix(f.account)
		if (account in unique) {
			unique[account] = toBn(unique[account]).plus(toBn(f.value)).toString()
		} else {
			unique[account] = f.value
		}
	})
	return Object.keys(unique).map(k => ({ account: toFlowAddress(k), value: toBigNumber(unique[k]) }))
}
