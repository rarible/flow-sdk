export interface Fcl {
	sansPrefix(address: string): null | string

	send(args: any[], opts?: {}): Promise<FlowTransactionResponse>

	getAccount(address: string): Promise<any>

	account(address: string): Promise<FlowAccount>

	config(): { put(c: string, a: string): any, get(label: string): Promise<string> }

	transaction(...a: any): any

	script(...a: any): any

	decode(a: any): any

	arg: FclArg

	args: FclArgs

	payer(...a: any): any

	tx: FclTx

	proposer(...a: any): any

	limit(...a: any): any

	currentUser(): FlowCurrentUser

	authz(): any

	authorizations(signature: any[]): any

	verifyUserSignature(message: string, compositeSignatures: any[]): any

	withPrefix(address: string): string
}

export interface FlowCurrentUser {
	snapshot(): Promise<any>

	signUserMessage(message: string): Promise<FlowSignature[]>
}

export type FlowSignature = {
	addr: string
	signature: string
	keyId: number
}

type TxSubscription = {
	subscribe(cb: (transaction: CommonFlowTransaction) => void): () => void
	onceSealed(): Promise<CommonFlowTransaction>
	snapshot(): CommonFlowTransaction
}

type FclTxExec = (...a: any) => TxSubscription

interface FclTx extends FclTxExec {
	isSealed(tx: CommonFlowTransaction): boolean
}

enum TxStatus {
	UNKNOWN = 0,
	PENDING = 1,
	FINALIZED = 2,
	EXECUTED = 3,
	SEALED = 4,
	EXPIRED = 5
}

type TransactionEvent = {
	type: string,
	[key: string]: any
}

export type CommonFlowTransaction = {
	status: TxStatus,
	statusCode: number,
	errorMessage: string,
	events: TransactionEvent[]
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

export type FlowAccount = {
	address: string
	balance: number
	code: string
	contracts: { [key: string]: string }
	keys: FlowAccountKey[]
}
type FlowAccountKey = {
	hashAlgo: number
	index: number
	publicKey: string
	revoked: boolean
	sequenceNumber: number
	signAlgo: number
	weight: number
}

export type FclArg = (value: string | number | object, xform: any) => any

export type FclArgs = (args: FclArg[]) => any[]
