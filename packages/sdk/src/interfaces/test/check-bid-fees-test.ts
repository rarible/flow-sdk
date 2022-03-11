import { toBigNumber } from "@rarible/types"
import { toBn } from "@rarible/utils"
import type { FlowFee } from "../../types"
import { withPrefix } from "../../common/prefix"
import { calculateFees } from "../order/common/calculate-fees"

export function checkBidFees(
	receivedFees: FlowFee[],
	expectedFees: FlowFee[],
	price: string,
): void {
	const calculatedExpectedFees = calculateFees(
		toBigNumber(price),
		expectedFees,
	)
	calculatedExpectedFees.forEach(f => {
		const fee = receivedFees.filter(i => withPrefix(i.account) === withPrefix(f.account))
		expect(fee[0].account).toEqual(f.account)
		expect(toBn(fee[0].value).toString()).toEqual(toBn(f.value).toString())
	})
	expect(receivedFees.length).toBeGreaterThanOrEqual(calculatedExpectedFees.length)
}
