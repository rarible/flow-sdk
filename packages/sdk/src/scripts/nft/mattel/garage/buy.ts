import {storefrontInit} from "../../storefront-init"
import {getBuyTxCode} from "../common/buy"
import {garageImports, garagePreparePartOfInit} from "./init"

export const garageBuyTxCode: string = getBuyTxCode({
	additionalImports: garageImports,
	preparePreHookCode: `
  ${garagePreparePartOfInit}
  ${storefrontInit}
`,
})
