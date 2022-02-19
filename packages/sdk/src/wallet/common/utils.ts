import type { FlowAddress } from "@rarible/types"
import { getBalanceScripts } from "@rarible/flow-sdk-scripts"
import type { FlowCurrency, FlowNetwork } from "../../types"
import { CONFIGS } from "../../config/config"
import { replaceImportAddresses } from "../../common/template-replacer"

export function getPreparedAddressArgument(address: FlowAddress): string {
	return dataToBase64String(JSON.stringify({ "type": "Address", "value": address }))
}

export function getPreparedCadenceScript(network: FlowNetwork, currency: FlowCurrency): string {
	const map = CONFIGS[network].mainAddressMap
	switch (currency) {
		case "FLOW":
			return dataToBase64String(replaceImportAddresses(getBalanceScripts.flow, map))
		case "FUSD":
			return dataToBase64String(replaceImportAddresses(getBalanceScripts.fusd, map))
		default:
			throw new Error("Flow-sdk Error: Unsupported currency")
	}
}

function dataToBase64String(data: string): string {
	return Buffer.from(data).toString("base64")
}
