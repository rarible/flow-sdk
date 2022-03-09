import type { FlowFee } from "../../types"
import { fixAmount } from "../../common/fix-amount"

type PreparedFees = { key: string, value: string }

export function prepareFees(fees: FlowFee[]): PreparedFees[] {
	const prepared: PreparedFees[] = []
	fees.forEach(f => {
		const value = fixAmount(f.value.toString())
		if (value !== "0.0") {
			prepared.push({
				key: f.account,
				value,
			})
		}
	})
	return prepared
}
