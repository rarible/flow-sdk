export interface RaribleSdk {
	nft: RaribleNftSdk
	apis: RaribleApis
}
export interface RaribleApis {}
export interface RaribleOrderSdk {}
export interface RaribleNftSdk {}

export const CONFIGS = {
	emulator: "",
	testnet: "",
	mainnet: ""
}
export type FCL = { //todo write types for fcl
	send: () => void,
}

export function createRaribleSdk(
	fcl: FCL,
	env: keyof typeof CONFIGS,
	walletProvider: string // todo maybe config params, for example value of gas
): RaribleSdk {

	const config = CONFIGS[env]

	return {
		apis: {},
		nft: {},
	}
}

type Arr = readonly unknown[];

function partialCall<T extends Arr, U extends Arr, R>(f: (...args: [...T, ...U]) => R, ...headArgs: T) {
	return (...tailArgs: U) => f(...headArgs, ...tailArgs)
}
