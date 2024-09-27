import type { WhitelabelCollection} from "../../contracts"
import type {Currency} from "../../common"
import {storefrontInit} from "../../storefront-init"
import {getChangePriceTxCode} from "../common/change-price"
import {getVaultInitTx, vaultOptions} from "../../init-vault"
import {garageImports, garagePreparePartOfInit} from "./init"

export const getGarageChangePriceTxCode = (collection: WhitelabelCollection, currency: Currency) => {
	const preparePreHookCode = `
    ${currency === "USDC" ? getVaultInitTx(vaultOptions["FiatToken"]): ""}
    ${garagePreparePartOfInit}
    ${storefrontInit}
  `

	return getChangePriceTxCode(collection, {
		additionalImports: garageImports,
		preparePreHookCode: preparePreHookCode,
	})
}
