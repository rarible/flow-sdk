import * as fcl from "@onflow/fcl"
import { authorization } from "./crypto"
import { replaceImportAddresses } from "./utils/replace-imports"
import { Networks } from "./config"

export type MethodArgs = {
	cadence: string
	args?: any
}

export const runScript = async (script: any[]) => {
	const result = await fcl.send(script)
	return await fcl.decode(result)
}

export type AddressMap = { [key: string]: string }

export const runTransaction = async (network: Networks, addressMap: AddressMap, params: MethodArgs, signers?: any[]): Promise<string> => {
	const code = replaceImportAddresses(params.cadence, addressMap)
	const ix = [fcl.limit(999)]
	switch (network) {
		case "emulator": {
			const serviceAuth = authorization()
			ix.push(fcl.payer(serviceAuth), fcl.proposer(serviceAuth))
			if (signers) {
				const auths = signers.map((address) => authorization(address))
				ix.push(fcl.authorizations(auths))
			} else {
				ix.push(fcl.authorizations([serviceAuth]))
			}
		}
		case "testnet":
		case "mainnet": {
			ix.push(fcl.payer(fcl.authz), fcl.proposer(fcl.authz), fcl.authorizations([fcl.authz]))
		}
	}

	if (params.args) {
		ix.push(...params.args)
	}
	ix.push(fcl.transaction(code))
	return fcl.send(ix).then(fcl.decode)
}

export const waitForSeal = async (txId: string) =>
	await fcl.tx(txId).onceSealed()

export const contractAddressHex = async (label: string) =>
	fcl.sansPrefix(await fcl.config.get(label))

