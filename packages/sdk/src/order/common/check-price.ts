import { toBn } from "@rarible/utils"
import { MIN_ORDER_PRICE } from "../../config/config"
import { fixAmount } from "../../common/fix-amount"

export function checkPrice(price: string): void {
	const fixedPrice = fixAmount(price)
	if (toBn(fixedPrice).lt(toBn(MIN_ORDER_PRICE))) {
		throw new Error(`Invalid price, minimal value is ${MIN_ORDER_PRICE}`)
	}
}
