import type { Fcl } from "../fcl"

export async function signUserMessage(fcl: Fcl, message: string): Promise<string> {
	const currentUser = fcl.currentUser()
	const userAddress = (await currentUser.snapshot()).addr
	const messageHex = Buffer.from(message).toString("hex")
	const signatures = await currentUser.signUserMessage(messageHex)
	if (signatures.length) {
		const signature = signatures.find(s => s.addr.toLowerCase() === userAddress.toLowerCase())?.signature
		if (signature) {
			return signature
		} else {
			throw Error(`Signature of user address "${userAddress}" not found`)
		}
	} else {
		throw Error("Response of signUserMessage is empty")
	}
}
