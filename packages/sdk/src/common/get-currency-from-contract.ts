import type { FlowContractAddress } from "@rarible/types"
import type { FlowCurrency } from "../types"
import { getCollectionData } from "./collection"

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
