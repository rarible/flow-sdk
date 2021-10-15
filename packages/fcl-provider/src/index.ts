export type FclConfig = {
	fcl: Fcl
	gas?: string | number
}

export class FclProvider implements Fcl {
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

	sansPrefix = this.fclConfig.fcl.sansPrefix
	send = this.fclConfig.fcl.send
	getAccount = this.fclConfig.fcl.getAccount
	config = this.fclConfig.fcl.config
	transaction = this.fclConfig.fcl.transaction
	script = this.fclConfig.fcl.script
	decode = this.fclConfig.fcl.decode
	arg = this.fclConfig.fcl.arg
	args = this.fclConfig.fcl.args
	payer = this.fclConfig.fcl.payer
	tx = this.fclConfig.fcl.tx
	proposer = this.fclConfig.fcl.proposer
	limit = this.fclConfig.fcl.limit
	currentUser = this.fclConfig.fcl.currentUser
}

export interface Fcl {
	sansPrefix(address: string): null | string

	send(args: any[], opts?: {}): Promise<any>

	getAccount(address: string): Promise<any>

	config(): { put(c: string, a: string): any }

	transaction(...a: any): any

	script(...a: any): any

	decode(a: any): any

	arg(...a: any): any

	args(...a: any): any

	payer(...a: any): any

	tx(...a: any): any

	proposer(...a: any): any

	limit(...a: any): any

	currentUser(): CurrentUser
}

interface CurrentUser {
	snapshot(): Promise<any>

	signUserMessage(message: string): Promise<Signature[]>
}

type Signature = {
	addr: string
	signature: string
}
