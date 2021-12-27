import type { FlowCurrency } from "../types"
import type { FlowContractAddress} from "./flow-address"
import { parseContractAddress } from "./flow-address"

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
