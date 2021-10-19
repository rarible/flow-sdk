export interface Fcl {
	sansPrefix(address: string): null | string

	send(args: any[], opts?: {}): Promise<any>

	getAccount(address: string): Promise<any>

	config(): { put(c: string, a: string): any, get(label: string): Promise<string> }

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

	authz(): any

	authorizations(signature: any[]): any

	verifyUserSignature(message: string, compositeSignatures: any[]): any

	withPrefix(address: string): string
}

interface CurrentUser {
	snapshot(): Promise<{ addr: string }>

	signUserMessage(message: string): Promise<Signature[]>
}

type Signature = {
	addr: string
	signature: string
}
