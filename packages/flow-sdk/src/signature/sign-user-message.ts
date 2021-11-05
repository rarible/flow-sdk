import type { Fcl } from "@rarible/fcl-types"

export async function signUserMessage(fcl: Fcl, message: string): Promise<string> {
	const currentUser = fcl.currentUser()
	const snapshot = await currentUser.snapshot()
	const address = snapshot.addr
	if (!address) {
		throw new Error("Unauthorized request")
	}
	const messageHex = Buffer.from(message).toString("hex")
	const signatures = await currentUser.signUserMessage(messageHex)
	if (signatures.length) {
		const signature = signatures.find(s => s.addr.toLowerCase() === address.toLowerCase())?.signature
		if (signature) {
			return signature
		}
		throw new Error(`Signature of user address "${address}" not found`)
	}
	throw new Error("Response of signUserMessage is empty")
}
