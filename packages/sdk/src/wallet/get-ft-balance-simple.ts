import type { FlowAddress } from "@rarible/types"
import type { FlowCurrency, FlowNetwork } from "../types"
import { sendRequest } from "./common/send-request"

export type GetFtBalanceRequest = {
	network: FlowNetwork
	address: FlowAddress
	currency: FlowCurrency
}
export type GetFtBalanceResponse = string

export async function getFungibleBalanceSimple(request: GetFtBalanceRequest): Promise<GetFtBalanceResponse> {
	const { network, address, currency } = request
	if (network === "emulator") {
		throw new Error("Can't get balance on emulator this way, emulator doesn't have http api for script execution")
	}
	const res = await sendRequest(network, currency, address)
	const { value } = JSON.parse(Buffer.from(res, "base64").toString())
	return value
}
