import type {
	WhitelabelCollection,
} from "../../contracts"
import type {Currency} from "../../common"
import {getVaultInitTx, vaultOptions} from "../../init-vault"
import {getListTxCode} from "../common/list"
import {barbieImports, barbiePreparePartOfInit} from "./init"

export const barbieListTxCode = (collection: WhitelabelCollection, currency: Currency) => {
	const preparePreHookCode = `
    ${currency === "USDC" ? getVaultInitTx(vaultOptions["FiatToken"]): ""}
    ${barbiePreparePartOfInit}
  `
	return getListTxCode(collection, { additionalImports: barbieImports, preparePreHookCode})
}
