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
