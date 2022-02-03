import type { FlowCurrency, NonFungibleContract } from "../../types"
import type { FtCodeConfig } from "../../config/cadence-code-config"
import { getFtCodeConfig, getNftCodeConfig } from "../../config/cadence-code-config"
import { fillCodeTemplate } from "../../common/template-replacer"

export function prepareOrderCode(code: string, collectionName: NonFungibleContract, currency: FlowCurrency) {
	let ftData: FtCodeConfig
	switch (currency) {
		case "FLOW":
			ftData = getFtCodeConfig("FlowToken")
			break
		case "FUSD":
			ftData = getFtCodeConfig("FUSD")
			break
		default:
			throw new Error("Unsupported currency")
	}

	return fillCodeTemplate(
		fillCodeTemplate(code, ftData),
		getNftCodeConfig(collectionName),
	)
}
