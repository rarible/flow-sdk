import type { FlowCurrency } from "../../../types"

export function getCurrencyFromVaultType(vaultType: string): FlowCurrency {
	const fungibleContract = vaultType.split(".")[2]
	switch (fungibleContract) {
		case "FlowToken":
			return "FLOW"
		case "FUSD":
			return "FUSD"
		default:
			throw new Error("Unsupported fungible token")
	}
}
