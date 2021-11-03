import { Fcl } from "@rarible/fcl-types"
import { AuthWithPrivateKey } from "../types"
import { FlowTransaction } from "../index"
import { replaceImportAddresses } from "./replace-imports"

export type MethodArgs = {
	cadence: string
	args?: any
}

export const runScript = async (
	fcl: Fcl,
	params: MethodArgs,
	addressMap: AddressMap,
) => {
	const cadence = replaceImportAddresses(params.cadence, addressMap)
	const result = await fcl.send([fcl.script`${cadence}`, params.args])
	return await fcl.decode(result)
}

export type AddressMap = { [key: string]: string }

export const runTransaction = async (
	fcl: Fcl,
	addressMap: AddressMap,
	params: MethodArgs,
	signature: AuthWithPrivateKey,
	gasLimit: number = 999,
): Promise<string> => {

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
	try {
		const tx = await fcl.send(ix)
		const { transactionId } = tx
		return transactionId
	} catch (e) {
		throw Error(`SDK:Transaction error: ${e}`)
	}
}

type TxEvent = {
	data: any,
	type: string
}

export type TxResult = {
	error: boolean,
	txId: string,
	events: TxEvent[]
	errorMessage?: string,
	status?: number
	statusCode?: number
}

export const waitForSeal = async (fcl: Fcl, txId: string): Promise<FlowTransaction> => {
	try {
		const sealed = await fcl.tx(txId).onceSealed()
		return {
			...sealed,
			txId,
		}
	} catch (e: any) {
		throw Error(`SDK:Transactions error: ${e}`)
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

export const contractAddressHex = async (fcl: Fcl, label: string) =>
	fcl.sansPrefix(await fcl.config().get(label))
