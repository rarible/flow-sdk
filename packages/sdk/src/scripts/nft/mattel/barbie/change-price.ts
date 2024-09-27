import type { WhitelabelCollection} from "../../contracts"
import type {Currency} from "../../common"
import {getVaultInitTx, vaultOptions} from "../../init-vault"
import {getChangePriceTxCode} from "../common/change-price"
import {barbieImports, barbiePreparePartOfInit} from "./init"

export const barbieChangePriceTxCode = (collection: WhitelabelCollection, currency: Currency) => {
	const preparePreHookCode = `
    ${currency === "USDC" ? getVaultInitTx(vaultOptions["FiatToken"]): ""}
    ${barbiePreparePartOfInit}
  `
	return getChangePriceTxCode(collection, {
		additionalImports: barbieImports,
		preparePreHookCode,
	})
}
