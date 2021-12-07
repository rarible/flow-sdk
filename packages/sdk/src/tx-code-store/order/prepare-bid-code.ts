import type { FlowCollectionName } from "../../common/collection"
import type { FlowContractName, FlowCurrency } from "../../types"
import type { FtCodeConfig, NftCodeConfig } from "../../config/cadence-code-config"
import { getFtCodeConfig, getNftCodeConfig } from "../../config/cadence-code-config"
import { fillCodeTemplate } from "../../common/template-replacer"

export function prepareBidCode(code: string, collectionName: FlowCollectionName, currency: FlowCurrency) {
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
	let nftCodeData: NftCodeConfig
	switch (collectionName) {
		case "RaribleNFT":
		case "TopShot":
		case "MotoGPCard":
		case "Evolution":
			nftCodeData = getNftCodeConfig(collectionName as FlowContractName)
			break
		default:
			throw new Error("Unsupported collection")
	}
	const codeWithFt = fillCodeTemplate(code, ftData)
	return fillCodeTemplate(codeWithFt, nftCodeData)
}
