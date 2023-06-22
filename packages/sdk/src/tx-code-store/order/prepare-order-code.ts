import type { FlowCurrency, NonFungibleContract } from "../../types"
import { getFtCodeConfig, getNftCodeConfig } from "../../config/cadence-code-config"
import { fillCodeTemplate } from "../../common/template-replacer"
import {convertFtCurrencyToContract} from "../common/convert-ft-currency-to-contract"

export function prepareOrderCode(code: string, collectionName: NonFungibleContract, currency: FlowCurrency) {
	return fillCodeTemplate(
		prepareFtCode(code, currency),
		getNftCodeConfig(collectionName),
	)
}

export function prepareFtCode(code: string, currency: FlowCurrency) {
	const ftContract = convertFtCurrencyToContract(currency)
	return fillCodeTemplate(code, getFtCodeConfig(ftContract))
}
