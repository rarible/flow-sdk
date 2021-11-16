import { toBn } from "@rarible/utils"
import { fixAmount } from "./fix-amount"

const MIN_PRICE = "0.0001"

export function checkPrice(price: string): void {
	const fixedPrice = fixAmount(price)
	if (toBn(fixedPrice).lt(toBn(MIN_PRICE))) {
		throw new Error(`Invalid price, minimal value is ${0.0001}`)
	}
}
