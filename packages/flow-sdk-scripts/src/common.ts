import * as fcl from "@onflow/fcl"

export const runScript = async (script: any[]) =>
	await fcl.send(script).then(fcl.decode)

export const runTransaction = async (tx: any[]) =>
	await fcl.send([
		...tx,
		fcl.payer(fcl.authz),
		fcl.proposer(fcl.authz),
		fcl.authorizations([fcl.authz]),
		fcl.limit(9999),
	]).then(fcl.decode)

export const waitForSeal = async (txId: string) =>
	await fcl.tx(txId).onceSealed()

export const contractAddressHex = async (label: string) =>
	fcl.sansPrefix(await fcl.config.get(label))
