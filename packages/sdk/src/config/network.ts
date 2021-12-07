import type { FlowNetwork } from "../types"

export type BlocktoWalletData = {
	accessNode: string
	wallet: string
}
export const blocktoWallet: Record<FlowNetwork, BlocktoWalletData> = {
	testnet: {
		accessNode: "https://access-testnet.onflow.org",
		wallet: "https://flow-wallet-testnet.blocto.app/authn",
	},
	mainnet: {
		accessNode: "https://flow-access-mainnet.portto.io",
		wallet: "https://flow-wallet.blocto.app/authn",
	},
	emulator: {
		accessNode: "127.0.0.1:3569",
		wallet: "",
	},
}
