import { sendRequest } from "../common/send-request"
import type { GetFtBalanceRequest, GetFtBalanceResponse } from "./domain"

export async function getFungibleBalanceSimpleHttp(request: GetFtBalanceRequest): Promise<GetFtBalanceResponse> {
	const { network, address, currency } = request
	const res = await sendRequest(network, currency, address)
	const { value } = JSON.parse(Buffer.from(res, "base64").toString())
	return value
}
