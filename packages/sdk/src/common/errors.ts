import type {MethodArgs} from "./transaction"

export type FlowSealErrorData = {
	code?: number
	error: any
	txId: string
}
export class FlowSealError extends Error {
	code?: number
	txId: string
	error: any
	constructor(data: FlowSealErrorData) {
		super(getErrorMessage(data?.error) || "FlowSealError")
		Object.setPrototypeOf(this, FlowSealError.prototype)
		this.name = "FlowSealError"
		this.error = data?.error
		this.code = data?.error?.code || data?.code
		this.txId = data?.txId
	}
}

export class FlowRunTransactionError extends Error {
	error: any
	params: MethodArgs
	constructor(data: { params: MethodArgs, error: any }) {
		super(getErrorMessage(data?.error) || "FlowRunTransactionError")
		Object.setPrototypeOf(this, FlowRunTransactionError.prototype)
		this.name = "FlowRunTransactionError"
		this.error = data?.error
		this.params = data?.params
	}
}
export class FlowRunScriptError extends Error {
	error: any
	params: MethodArgs
	constructor(data: { params: MethodArgs, error: any }) {
		super(getErrorMessage(data?.error) || "FlowRunScriptError")
		Object.setPrototypeOf(this, FlowRunTransactionError.prototype)
		this.name = "FlowRunScriptError"
		this.error = data?.error
		this.params = data?.params
	}
}

export function getErrorMessage(error: any) {
	if (typeof error === "string") return error
	return error?.message
}
