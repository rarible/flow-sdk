import type { FlowNetwork } from "../types"

export type FlowEnv = "mainnet" | "dev" | "staging" | "emulator"

export type FlowEnvConfig = Record<FlowEnv, {
	basePath: string
	network: FlowNetwork
}>

export const FLOW_ENV_CONFIG: FlowEnvConfig = {
	emulator: {
		basePath: "",
		network: "emulator",
	},
	dev: {
		basePath: "https://flow-api-dev.rarible.org",
		network: "testnet",
	},
	staging: {
		basePath: "https://flow-api-staging.rarible.org",
		network: "testnet",
	},
	mainnet: {
		basePath: "https://flow-api.rarible.org",
		network: "mainnet",
	},
}
