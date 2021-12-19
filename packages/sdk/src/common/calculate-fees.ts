import type { BigNumber } from "@rarible/types"
import { toBigNumber } from "@rarible/types"
import { toBn } from "@rarible/utils"
import type { FlowFee } from "../types"

export function calculateFees(price: BigNumber, fees: FlowFee[]): FlowFee[] {
	return fees.map(fee => {
		const value: BigNumber = toBigNumber(
			toBn(price.toString()).multipliedBy(fee.value).decimalPlaces(8).toString(),
		)
		return { account: fee.account, value }
	})
}
