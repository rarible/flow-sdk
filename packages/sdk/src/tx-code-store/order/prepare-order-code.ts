import type { FlowContractName, FlowCurrency, NonFungibleContract } from "../../types"
import type { FtCodeConfig, NftCodeConfig } from "../../config/cadence-code-config"
import { getFtCodeConfig, getNftCodeConfig } from "../../config/cadence-code-config"
import { fillCodeTemplate } from "../common/template-replacer"

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
	let nftCodeData: NftCodeConfig
	switch (collectionName) {
		case "RaribleNFT":
		case "TopShot":
		case "MotoGPCard":
		case "Evolution":
		case "MugenNFT":
		case "CNN_NFT":
			nftCodeData = getNftCodeConfig(collectionName as FlowContractName)
			break
		default:
			throw new Error("Unsupported collection")
	}
	const codeWithFt = fillCodeTemplate(code, ftData)
	return fillCodeTemplate(codeWithFt, nftCodeData)
}
