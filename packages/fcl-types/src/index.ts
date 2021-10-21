export interface Fcl {
	sansPrefix(address: string): null | string

	send(args: any[], opts?: {}): Promise<FlowTransactionResponse>

	getAccount(address: string): Promise<any>

	config(): { put(c: string, a: string): any, get(label: string): Promise<string> }

	transaction(...a: any): any

	script(...a: any): any

	decode(a: any): any

	arg(...a: any): any

	args(...a: any): any

	payer(...a: any): any

	tx: FclTx

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

type TxSubscription = {
	subscribe(cb: (transaction: FlowTransaction) => void): () => void
	onceSealed(): Promise<FlowTransaction>
}

type FclTxExec = (...a: any) => TxSubscription

interface FclTx extends FclTxExec {
	isSealed(tx: FlowTransaction): boolean
}

enum TxStatus {
	UNKNOWN = 0,
	PENDING = 1,
	FINALIZED = 2,
	EXECUTED = 3,
	SEALED = 4,
	EXPIRED = 5
}

export type FlowTransaction = {
	status: TxStatus,
	statusCode: number,
	errorMessage: string,
	events: any[]
}

type Signature = {
	addr: string
	signature: string
}

type FlowTransactionResponse = {
	tag: "TRANSACTION" | "SCRIPT",
	transaction: any,
	transactionStatus: number,
	transactionId: string,
	encodedData: any,
	events: any,
	account: any,
	block: any,
	blockHeader: any,
	latestBlock: any,
	collection: any
}
