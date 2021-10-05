import * as fcl from "@onflow/fcl"

interface CurrentUser {
	snapshot(): Promise<any>

	signUserMessage(message: string): Promise<Signature[]>
}

type Signature = {
	addr: string
	signature: string
}

export async function signUserMessage(message: string): Promise<string> {
	const currentUser: CurrentUser = fcl.currentUser()
	const userAddress = (await currentUser.snapshot()).addr
	const messageHex = Buffer.from(message).toString("hex")
	const signatures: Signature[] = await currentUser.signUserMessage(messageHex)
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
