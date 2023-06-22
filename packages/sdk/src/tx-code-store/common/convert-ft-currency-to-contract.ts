import type {FlowCurrency, FungibleContracts} from "../../types"

export function convertFtCurrencyToContract(currency: FlowCurrency): FungibleContracts {
	switch (currency) {
		case "FLOW":
			return "FlowToken"
		case "FUSD":
			return "FUSD"
		case "USDC":
			return "FiatToken"
		default:
			throw new Error("Unsupported currency")
	}
}
