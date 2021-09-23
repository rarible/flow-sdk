declare module "@onflow/fcl" {
	export function sansPrefix(address: string): null | string

	export function send(args: any[], opts?: {}): Promise<any>

	export function getAccount(address: string): Promise<any>

	export function config(): { put(c: string, a: string): ReturnType<typeof config> }

	export function transaction(...a: any): any

	export function script(...a: any): any

	export function decode(a: any): any

	export function arg(...a: any): any

	export function args(...a: any): any

	export function payer(...a: any): any

	export function tx(...a: any): any

	export function proposer(...a: any): any

	export function tx(...a: any): any

	export function limit(...a: any): any

	export function tx(...a: any): any

	export function currentUser(): any
}

declare module "@onflow/types";

declare module "flow-js-testing" {
	export function init(basePath: string): Promise<void>
	export function init(basePath: string, props: object): Promise<void>

	export function mintFlow(recipient: string, amount: string): Promise<any>

	export function shallPass(ix: Function | Promise<any>): Promise<any>

	export function sendTransaction(props: object): Promise<any>

	export function executeScript(props: object): Promise<any>

	export function getContractAddress(name: string): Promise<string>
	export function getContractAddress(name: string, useDefaults: boolean): Promise<string>

	export function deployContractByName(props: object): Promise<any>

	export const emulator: any

	export function getAccountAddress(accountName: string): Promise<string>

	export function script(...args: any[]): any
}

declare module "*.cdc" {
	const content: string
	// eslint-disable-next-line import/no-default-export
	export default content
}

declare module "text!*" {
	const content: string
	// eslint-disable-next-line import/no-default-export
	export default content
}
