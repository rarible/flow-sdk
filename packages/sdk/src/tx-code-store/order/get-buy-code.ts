import { Storefront } from "@rarible/flow-sdk-scripts"
import type { FlowCurrency, FungibleContracts } from "../../types"
import { orderCodeConfig } from "../../config"
import type { FlowCollectionName } from "../../common/collection"

export function getBuyCode(
	currency: FlowCurrency,
	collectionName: FlowCollectionName,
): string {
	let ftContractName: FungibleContracts, vaultPath: string
	switch (currency) {
		case "FLOW":
			ftContractName = "FlowToken"
			vaultPath = "flowToken"
			break
		case "FUSD":
			ftContractName = "FUSD"
			vaultPath = "fusd"
			break
		default:
			throw new Error("Unsupported currency")
	}

	const { code, placeholders } = Storefront.buy
	return code.replace(new RegExp(placeholders.nftContractName, "g"), collectionName)
		.replace(new RegExp(placeholders.ftContractName, "g"), ftContractName)
		.replace(new RegExp(placeholders.vaultPath, "g"), vaultPath)
		.replace(
			new RegExp(placeholders.collectionStoragePath, "g"), orderCodeConfig[collectionName].collectionPath,
		).replace(
			new RegExp(placeholders.nftCollectionPublicPath, "g"), orderCodeConfig[collectionName].collectionPublicPath,
		)
		.replace(
			new RegExp(placeholders.tokenReceiver, "g"), orderCodeConfig[collectionName].nftReceiver,
		)
		.replace(
			new RegExp(placeholders.linkArg, "g"), orderCodeConfig[collectionName].linkArg,
		)
}
