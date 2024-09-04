import type {
	WhitelabelCollection,
} from "../../contracts"
import type {Currency} from "../../common"
import {getVaultInitTx, vaultOptions} from "../../init-vault"
import {storefrontInit} from "../../storefront-init"
import {getListTxCode} from "../common/list"
import {garageImports, garagePreparePartOfInit} from "./init"

export const getGarageListTxCode = (collection: WhitelabelCollection, currency: Currency) => {
	const preparePreHookCode = `
    ${currency === "USDC" ? getVaultInitTx(vaultOptions["FiatToken"]): ""}
    ${garagePreparePartOfInit}
    ${storefrontInit}
  `
	return getListTxCode(collection, { additionalImports: garageImports, preparePreHookCode})
}
