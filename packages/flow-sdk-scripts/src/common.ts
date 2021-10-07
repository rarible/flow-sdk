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
	error: Error | null,
	txId: string
}

export const waitForSeal = async (txId: string): Promise<TxResult> => {
	try {
		await fcl.tx(txId).onceSealed()
		return { error: null, txId }
	} catch (e: any) {
		return {
			error: {
				message: `Transaction sent, but got error when wait for seal: ${e}`,
				name: "Transaction processing error",
			},
			txId,
		}
	}
}

export const contractAddressHex = async (label: string) =>
	fcl.sansPrefix(await fcl.config.get(label))
