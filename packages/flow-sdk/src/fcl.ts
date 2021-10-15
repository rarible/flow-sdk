export type Fcl = {
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

	tx(...a: any): any

	limit(...a: any): any

	tx(...a: any): any

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
