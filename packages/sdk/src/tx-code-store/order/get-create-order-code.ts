import { Storefront } from "@rarible/flow-sdk-scripts"
import type { FlowCurrency, FlowFee, FungibleContracts } from "../../types"
import { fixAmount } from "../../common/fix-amount"
import type { FlowCollectionName } from "../../common/collection"
import { orderCodeConfig } from "../../config/cadence-code-config"

export function getCreateUpdateOrderCode(
	type: "create" | "update",
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

	const { code, placeholders } = type === "create" ? Storefront.createSellOrder : Storefront.updateOrder
	return code.replace(new RegExp(placeholders.nftContractName, "g"), collectionName)
		.replace(new RegExp(placeholders.ftContractName, "g"), ftContractName)
		.replace(new RegExp(placeholders.vaultPath, "g"), vaultPath)
		.replace(
			new RegExp(placeholders.nftProviderPath, "g"), orderCodeConfig[collectionName].nftProviderPath,
		).replace(
			new RegExp(placeholders.collectionStoragePath, "g"), orderCodeConfig[collectionName].collectionPath,
		)
}

export function prepareFees(fees: FlowFee[]): { key: string, value: string }[] {
	return fees.map(f => ({
		key: f.account,
		value: fixAmount(f.value.toString()),
	}))
}
