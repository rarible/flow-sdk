import type { FlowAddress } from "@rarible/types"
import { getBalanceScripts } from "@rarible/flow-sdk-scripts"
import type { FlowCurrency, FlowNetwork } from "../../../types"
import { CONFIGS } from "../../../config/config"
import { replaceImportAddresses } from "../../../blockchain-api/common/template-replacer"

export function getPreparedAddressArgument(address: FlowAddress): string {
	return dataToBase64String(JSON.stringify({ "type": "Address", "value": address }))
}

export function getPreparedCadenceScript(
	network: FlowNetwork, currency: FlowCurrency, dataType: FlowUtilsStringDataType,
): string {
	const map = CONFIGS[network].mainAddressMap
	switch (currency) {
		case "FLOW":
			return dataToDatatypeString(replaceImportAddresses(getBalanceScripts.flow, map), dataType)
		case "FUSD":
			return dataToDatatypeString(replaceImportAddresses(getBalanceScripts.fusd, map), dataType)
		default:
			throw new Error("Flow-sdk Error: Unsupported currency")
	}
}

export enum FlowUtilsStringDataType {
	base64 = "base64",
	utf8 = "utf8"
}

function dataToDatatypeString(data: string, type: FlowUtilsStringDataType): string {
	return Buffer.from(data).toString(type)
}

function dataToBase64String(data: string): string {
	return Buffer.from(data).toString("base64")
}
