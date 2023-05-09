import type { Fcl } from "@rarible/fcl-types"
import type { AuthWithPrivateKey, FlowTransaction } from "../types"
import { replaceImportAddresses } from "./template-replacer"
import {FlowRunScriptError, FlowRunTransactionError, FlowSealError} from "./errors"

export type MethodArgs = {
	cadence: string
	args?: any
}

export const runScript = async (
	fcl: Fcl,
	params: MethodArgs,
	addressMap: Record<string, string>,
) => {
	try {
		const cadence = replaceImportAddresses(params.cadence, addressMap)
		const result = await fcl.send([fcl.script`${cadence}`, params.args])
		return await fcl.decode(result)
	} catch (error) {
		throw new FlowRunScriptError({ error, params })
	}
}

export const runTransaction = async (
	fcl: Fcl,
	addressMap: Record<string, string>,
	params: MethodArgs,
	signature: AuthWithPrivateKey,
	gasLimit: number = 999,
): Promise<string> => {
	try {
		const code = replaceImportAddresses(params.cadence, addressMap)
		const ix = [fcl.limit(gasLimit)]
		ix.push(
			fcl.payer(signature || fcl.authz),
			fcl.proposer(signature || fcl.authz),
			fcl.authorizations([signature || fcl.authz]),
		)

		if (params.args) {
			ix.push(params.args)
		}
		ix.push(fcl.transaction(code))
		const tx = await fcl.send(ix)
		return tx.transactionId
	} catch (error) {
		throw new FlowRunTransactionError({error, params })
	}
}


export const waitForSeal = async (fcl: Fcl, txId: string): Promise<FlowTransaction> => {
	try {
		const sealed = await fcl.tx(txId).onceSealed()
		return {
			...sealed,
			txId,
		}
	} catch (error) {
		throw new FlowSealError({ error, txId })
	}
}

export function subscribeForTxResult(fcl: Fcl, txId: string, cb: (tx: FlowTransaction) => void) {
	const unsub = fcl
		.tx(txId)
		.subscribe((transaction) => {
			cb({ txId, ...transaction })
			if (fcl.tx.isSealed(transaction)) {
				unsub()
			}
		})
}

export const contractAddressHex = async <T extends Record<string, any>>(fcl: Fcl<T>, label: keyof T) => {
	const contract = await fcl.config().get(label)
	return fcl.sansPrefix(contract)
}
