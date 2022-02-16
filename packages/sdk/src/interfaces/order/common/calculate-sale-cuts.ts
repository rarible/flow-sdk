import { toBn } from "@rarible/utils"
import type { FlowAddress } from "@rarible/types"
import { toBigNumber, toFlowAddress } from "@rarible/types"
import type { FlowFee } from "../../../types/types"
import { withPrefix } from "../../../common/prefix"

/**
 * Gets fees in percents and convert to currency value
 * @param mainPayoutAddress - seller address
 * @param price - order price
 * @param fees - royalties, protocolFee, originFee
 * @param payouts - payoutFee
 * @returns FlowFee - calculated fees in currency
 */
export function calculateSaleCuts(
	mainPayoutAddress: FlowAddress,
	price: string, fees: FlowFee[],
	payouts: FlowFee[],
): FlowFee[] {
	const startPrice = toBn(price)
	let leftAfterFees = toBn(price)
	const resultFeeSaleCuts: FlowFee[] = fees.map(fee => {
		const value = startPrice.multipliedBy(toBn(fee.value))
		leftAfterFees = leftAfterFees.minus(value)
		return {
			...fee,
			value: toBigNumber(value.decimalPlaces(8).toString()),
		}
	})
	let leftAfterPayouts = toBn(leftAfterFees)
	const resultPayoutSaleCuts: FlowFee[] = payouts.map(fee => {
		const value = leftAfterFees.multipliedBy(toBn(fee.value))
		leftAfterPayouts = leftAfterPayouts.minus(value)
		return {
			...fee,
			value: toBigNumber(value.decimalPlaces(8).toString()),
		}
	})
	if (leftAfterPayouts.gt(0)) {
		resultPayoutSaleCuts.push({
			account: mainPayoutAddress,
			value: toBigNumber(leftAfterPayouts.decimalPlaces(8).toString()),
		})
	} else if (leftAfterPayouts.lt(0)) {
		throw new Error("Sum of payouts greater than price")
	}
	return concatNonUniqueFees([...resultFeeSaleCuts, ...resultPayoutSaleCuts])
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
	return Object.keys(unique).map(k => ({
		account: toFlowAddress(k),
		value: toBigNumber(unique[k]),
	}))
}
