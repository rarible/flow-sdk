import type { FlowNetwork } from "../types"

export type FlowEnv = "mainnet" | "dev" | "staging" | "emulator"

type FlowEnvConfig = {
	basePath: string
	network: FlowNetwork
}

export const ENV_CONFIG: Record<FlowEnv, FlowEnvConfig> = {
	emulator: {
		basePath: "",
		network: "emulator",
	},
	dev: {
		basePath: "https://flow-api-dev.rarible.com",
		network: "testnet",
	},
	staging: {
		basePath: "https://flow-api-staging.rarible.com",
		network: "testnet",
	},
	mainnet: {
		basePath: "https://flow-api.rarible.com",
		network: "mainnet",
	},
}
