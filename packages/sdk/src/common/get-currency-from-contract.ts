import type { FlowCurrency } from "../types"
import { getCollectionData } from "./collection"
import type { FlowContractAddress } from "./flow-address"

export function getCurrencyFromContract(contract: FlowContractAddress): FlowCurrency {
	const { name } = getCollectionData(contract)
	switch (name) {
		case "FlowToken":
			return "FLOW"
		case "FUSD":
			return "FUSD"
		default:
			throw new Error(`${name} in not fungible contract`)
	}
}
