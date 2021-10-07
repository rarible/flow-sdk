import * as fcl from "@onflow/fcl"
import { replaceImportAddresses } from "./utils/replace-imports"

export type MethodArgs = {
	cadence: string
	args?: any
}

export const runScript = async (script: any[]) => {
	const result = await fcl.send(script)
	return await fcl.decode(result)
}

export type AddressMap = { [key: string]: string }

export const runTransaction = async (addressMap: AddressMap, params: MethodArgs): Promise<string> => {
	const code = replaceImportAddresses(params.cadence, addressMap)
	const ix = [fcl.limit(999)]
	ix.push(fcl.payer(fcl.authz), fcl.proposer(fcl.authz), fcl.authorizations([fcl.authz]))

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

export const waitForSeal = async (txId: string): Promise<TxResult> => {
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

export const contractAddressHex = async (label: string) =>
	fcl.sansPrefix(await fcl.config.get(label))
