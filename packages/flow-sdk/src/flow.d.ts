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
