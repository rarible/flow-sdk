export interface Fcl<T extends Record<string, any> = {}> {
	sansPrefix(address: string): null | string

	send(args: unknown[], opts?: {}): Promise<FlowTransactionResponse>

	authenticate(): Promise<FlowUserData>

	unauthenticate(): Promise<void>

	currentUser(): FlowCurrentUser

	getAccount(address: string): Promise<FlowAccount>

	account(address: string): Promise<FlowAccount>

	config(): FlowConfig<FclConfigDictionary<T>>

	transaction(...a: any): any

	script(...a: any): any

	decode(response: FlowTransactionResponse): Promise<any>

	arg: FclArg
	args: FclArgs

	payer(...a: any): any

	tx: FclTx

	proposer(...a: any): any

	limit(...a: any): any

	authz(): FlowAuthorizationObject

	authorizations(signature: any[]): any

	verifyUserSignature(message: string, compositeSignatures: any[]): any

	withPrefix(address: string): string
}

export type FclConfigDictionary<T extends Record<string, any>> = T & {
	env: "local" | "canarynet" | "testnet" | "mainnet"
	"accessNode.api": string
	"discovery.wallet": string
	"app.detail.title": string
	"app.detail.icon": string
	"challenge.handshake": string
}

export type FlowConfig<T extends Record<string, any>> = {
	put<K extends keyof T>(key: K, value: any): FlowConfig<T>
	get<K extends keyof T>(key: K): Promise<T[K]>
}

export type FlowAuthorizationObject = {
	addr: string
	signingFunction: Function
	keyId: number
	sequenceNum: number
}

export type FlowCurrentUser = {
	authorization: FlowAuthorizationObject
	snapshot(): Promise<FlowUserData>
	signUserMessage(message: string): Promise<FlowSignature[]>
	authenticate(): Promise<FlowUserData>
	unauthenticate(): Promise<void>
	subscribe(handler: (user: FlowUserData) => void): void
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

export enum FlowTxStatus {
	UNKNOWN = 0,
	PENDING = 1,
	FINALIZED = 2,
	EXECUTED = 3,
	SEALED = 4,
	EXPIRED = 5,
}

export type TransactionEvent = {
	type: string
	[key: string]: any
}

export type CommonFlowTransaction = {
	status: FlowTxStatus
	statusCode: number
	errorMessage: string
	events: TransactionEvent[]
}

export enum FlowTransactionTag {
	TRANSACTION = "TRANSACTION",
	SCRIPT = "SCRIPT",
}

/**
 * In form `A.{AccountAddress}.{ContractName}.{EventName}`
 * @example A.ba1132bc08f82fe2.Debug.Log
 */
export type FlowEventName = string & {
	__IS_FLOW_EVENT_NAME__: true
}

export type FlowTransactionResponse = {
	type: FlowEventName
	tag: FlowTransactionTag
	transaction: any
	transactionStatus: number
	transactionId: string
	encodedData: any
	events: any
	account: any
	block: any
	blockHeader: any
	latestBlock: any
	collection: any
}

export type FlowCadanceContract = string & {
	__IS_FLOW_CADANCE_CONTRACT__: true
}

export type FlowAccount = {
	address: string
	balance: number
	code: string
	contracts: Record<FlowCadanceContract, string>
	keys: FlowAccountKey[]
}

export type FlowAccountKey = {
	hashAlgo: number
	index: number
	publicKey: string
	revoked: boolean
	sequenceNumber: number
	signAlgo: number
	weight: number
}

export type FlowUserData = {
	addr: undefined | string
	cid: undefined | string
	expiresAt: undefined | string
	"f_type": "USER"
	"f_vsn": string
	loggedIn: boolean
	services: Object[]
}

export type FclArg = (value: string | number | object | null, xform: any) => any
export type FclArgs = (args: FclArg[]) => any[]
