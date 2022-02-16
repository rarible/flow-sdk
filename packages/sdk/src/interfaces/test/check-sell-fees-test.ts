import type { FlowAddress } from "@rarible/types"
import { toBn } from "@rarible/utils"
import type { FlowFee } from "../../types/types"
import { calculateSaleCuts } from "../order/common/calculate-sale-cuts"
import { withPrefix } from "../../common/prefix"

export function checkSellFees(
	receivedFees: FlowFee[],
	expected: { payouts?: FlowFee[], originFees?: FlowFee[] },
	orderProposerAddress: FlowAddress,
	price: string,
): void {
	const calculatedExpectedFees = calculateSaleCuts(
		orderProposerAddress,
		price,
		expected.originFees || [],
		expected.payouts || [],
	)
	calculatedExpectedFees.forEach(f => {
		const fee = receivedFees.filter(i => withPrefix(i.account) === withPrefix(f.account))
		expect(fee.length).toEqual(1)
		expect(fee[0].account).toEqual(f.account)
		expect(toBn(fee[0].value).toString()).toEqual(toBn(f.value).toString())
	})
	expect(receivedFees.length).toBeGreaterThanOrEqual(calculatedExpectedFees.length)
}
