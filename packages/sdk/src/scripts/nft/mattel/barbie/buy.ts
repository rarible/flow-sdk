import {getBuyTxCode} from "../common/buy"
import {barbieImports, barbiePreparePartOfInit} from "./init"

export const barbieBuyTxCode: string = getBuyTxCode({
	additionalImports: barbieImports,
	preparePreHookCode: `
  ${barbiePreparePartOfInit}
`,
})
