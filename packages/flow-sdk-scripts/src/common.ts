import * as fcl from "@onflow/fcl"
import { mapValuesToCode } from "flow-cadut"
import { authorization } from "./crypto"
import { replaceImportAddresses } from "./utils/replace-imports"

export type Networks = "emulator" | "testnet" | "mainnet"

export type MethodArgs = {
	type: "tx" | "script"
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
	switch (params.type) { //todo may be split to separate functions e.g. sunScript and runTx
		case "tx": {
			if (params.args) {
				ix.push(fcl.args(resolveArguments(params.args, code)))
			}
			ix.push(fcl.transaction(code))
			return fcl.send(ix).then(fcl.decode)
		}
		case "script": {
			if (params.args) {
				ix.push(fcl.args(resolveArguments(params.args, code)))
			}
			ix.push(fcl.script(code))
			return fcl.send(ix).then(fcl.decode)
		}
	}
}

export const unwrap = (arr: any[], convert: any) => {
	const type = arr[arr.length - 1]
	return arr.slice(0, -1).map((value) => convert(value, type))
}

const mapArgs = (args: any[]) => {
	return args.reduce((acc, arg) => {
		const unwrapped = unwrap(arg, (value: any, type: any) => {
			return fcl.arg(value, type)
		})
		acc = [...acc, ...unwrapped]
		return acc
	}, [])
}

const resolveArguments = (args: any[], code: string) => {
	if (args.length === 0) {
		return []
	}

	const first = args[0]
	if (Array.isArray(first)) {
		const last = first[first.length - 1]
		if (last.asArgument) {
			return mapArgs(args)
		}
	}
	return mapValuesToCode(code, args)
}

export const waitForSeal = async (txId: string) =>
	await fcl.tx(txId).onceSealed()

export const contractAddressHex = async (label: string) =>
	fcl.sansPrefix(await fcl.config.get(label))

