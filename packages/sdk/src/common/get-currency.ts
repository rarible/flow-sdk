import type { FlowContractAddress } from "../types/contract-address"
import { parseContractAddress } from "../types/contract-address"
import type { FlowCurrency } from "../types/types"

export function getCurrency(contract: FlowContractAddress): FlowCurrency {
	const { name } = parseContractAddress(contract)
	switch (name) {
		case "FUSD":
			return "FUSD"
		case "FlowToken":
			return "FLOW"
		default:
			throw new Error(`Isn't fungible contract address: ${contract}`)
	}
}
