import { Fcl } from "@rarible/fcl-types"
import { Networks } from "@rarible/flow-sdk/build/config"

export type FclConfig = {
	fcl: Fcl
	network: Networks
	gas?: string | number
}

export class FclProvider {
	constructor(private readonly fclConfig: FclConfig) {
	}

	async personalSign(message: string): Promise<string> {
		const currentUser = this.fclConfig.fcl.currentUser()
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
}
