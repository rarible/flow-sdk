import type { BigNumberLike } from "@rarible/types"
import { toBigNumberLike } from "@rarible/types"
import { toBn } from "@rarible/utils"
import type { FlowFee } from "../types"
import { concatNonUniqueFees } from "../order/common/calculate-sale-cuts"

export function calculateFees(price: BigNumberLike, fees: FlowFee[]): FlowFee[] {
	const calculatedFees = fees.map(fee => {
		const value: BigNumberLike = toBigNumberLike(
			toBn(price.toString()).multipliedBy(fee.value).decimalPlaces(8).toString(),
		)
		return { account: fee.account, value }
	})
	return concatNonUniqueFees(calculatedFees)
}
