import type { FlowNetwork } from "../types"

export type FlowEnv = "mainnet" | "dev" | "testnet" | "emulator" | "dev-testnet"

export type FlowEnvConfig = Record<FlowEnv, {
	basePath: string
	network: FlowNetwork
}>

export const ENV_CONFIG: FlowEnvConfig = {
	emulator: {
		basePath: "",
		network: "emulator",
	},
	dev: {
		basePath: "https://flow-api-dev.rarible.com",
		network: "testnet",
	},
	testnet: {
		basePath: "https://testnet-flow-api.rarible.org",
		network: "testnet",
	},
	mainnet: {
		basePath: "https://flow-api.rarible.org",
		network: "mainnet",
	},
	"dev-testnet": {
		basePath: "https://dev-flow-api.rarible.org",
		network: "testnet",
	},
}
