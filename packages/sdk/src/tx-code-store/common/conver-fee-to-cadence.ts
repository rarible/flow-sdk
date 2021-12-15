import type { FlowFee } from "../../types"
import { fixAmount } from "../../common/fix-amount"

export function prepareFees(fees: FlowFee[]): { key: string, value: string }[] {
	return fees.map(f => ({
		key: f.account,
		value: fixAmount(f.value.toString()),
	}))
}
