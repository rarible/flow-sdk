import type { FlowAddress } from "@rarible/types"
import type { FlowCurrency, FlowNetwork } from "../../../types"

export type GetFtBalanceRequest = {
	network: FlowNetwork
	address: FlowAddress
	currency: FlowCurrency
}
export type GetFtBalanceResponse = string
