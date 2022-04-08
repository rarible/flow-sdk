import type { FlowAddress } from "@rarible/types"
import { NODE_HTTP_TRANSPORT_CONFIG } from "../../../config/config"
import type { FlowCurrency, FlowNetwork } from "../../../types"
import { httpRequest } from "./http-request"
import { FlowUtilsStringDataType, getPreparedAddressArgument, getPreparedCadenceScript } from "./utils"

export async function sendRequest(network: FlowNetwork, currency: FlowCurrency, address: FlowAddress) {
	return httpRequest({
		hostname: NODE_HTTP_TRANSPORT_CONFIG[network],
		path: "/v1/scripts?block_height=sealed",
		method: "POST",
		body: {
			"script": getPreparedCadenceScript(network, currency, FlowUtilsStringDataType.base64),
			"arguments": [getPreparedAddressArgument(address)],
		},
	})
}
