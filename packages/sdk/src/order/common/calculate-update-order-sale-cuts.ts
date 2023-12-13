import { toBn } from "@rarible/utils"
import { toBigNumberLike } from "@rarible/types"
import type { FlowFee } from "../../types"

export function calculateUpdateOrderSaleCuts(oldPrice: string, price: string, fees: FlowFee[]): FlowFee[] {
	return fees.map(fee => {
		return {
			...fee,
			value: toBigNumberLike(toBn(fee.value).div(toBn(oldPrice)).multipliedBy(toBn(price)).decimalPlaces(8).toString()),
		}
	})
}
