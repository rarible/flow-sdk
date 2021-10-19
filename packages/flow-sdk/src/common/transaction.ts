import { Fcl } from "@rarible/fcl-types"
import { replaceImportAddresses } from "./replace-imports"

export type MethodArgs = {
	cadence: string
	args?: any
}

export const runScript = async (fcl: Fcl, code: string, addressMap: AddressMap) => {
	const cadence = replaceImportAddresses(code, addressMap)
	const result = await fcl.send([fcl.script`${cadence}`])
	return await fcl.decode(result)
}

export type AddressMap = { [key: string]: string }

export const runTransaction = async (
	fcl: Fcl,
	addressMap: AddressMap,
	params: MethodArgs,
	signature: any = fcl.authz,
): Promise<string> => {

	const code = replaceImportAddresses(params.cadence, addressMap)
	const ix = [fcl.limit(999)]
	ix.push(fcl.payer(signature), fcl.proposer(signature), fcl.authorizations([signature]))

	if (params.args) {
		ix.push(params.args)
	}
	ix.push(fcl.transaction(code))
	return fcl.send(ix).then(fcl.decode)
}

export type TxResult = {
	error: boolean,
	txId: string,
	events: any[]
	errorMessage?: string,
	status?: number
	statusCode?: number
}

export const waitForSeal = async (fcl: Fcl, txId: string): Promise<TxResult> => {
	try {
		const sealed = await fcl.tx(txId).onceSealed()
		return { error: false, txId, ...sealed }
	} catch (e: any) {
		return {
			error: true,
			errorMessage: `Transaction sent, but got error when wait for seal: ${e}`,
			txId,
			events: [],
		}
	}
}

export const contractAddressHex = async (fcl: Fcl, label: string) =>
	fcl.sansPrefix(await fcl.config().get(label))
