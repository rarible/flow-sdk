import { toBn } from "@rarible/utils"
import { toBigNumber } from "@rarible/types"
import type { FlowFee } from "../../types"

export function calculateUpdateOrderSaleCuts(oldPrice: string, price: string, fees: FlowFee[]): FlowFee[] {
	return fees.map(fee => {
		return {
			...fee,
			value: toBigNumber(toBn(fee.value).div(toBn(oldPrice)).multipliedBy(toBn(price)).decimalPlaces(8).toString()),
		}
	})
}
