import { AddressMap } from "@rarible/flow-sdk-scripts/build/common"

export type Networks = "emulator" | "testnet" | "mainnet"

const blocktoWallet = "https://flow-wallet-testnet.blocto.app/authn"
const fclWalletSelect = "https://fcl-discovery.onflow.org/testnet/authn"


export const contracts: Record<Networks, string> = {
	emulator: "",
	testnet: "0x665b9acf64dfdfdb",
	mainnet: "",
}
export const testnetOwnerContractsAddress = "0x631e88ae7f1d7c20"

type Config = {
	walletDiscovery: string,
	accessNode: string,
	contracts: AddressMap,
	contractsOwnerAddress: string
}

export function getContractsAddressMap(network: Networks, address: string) {
	const map: AddressMap = {}
	Object.keys(CONFIGS[network].contracts).forEach(k => {
		map[k] = address
	})
	return map
}

export const CONFIGS: Record<Networks, Config> = {
	emulator: {
		walletDiscovery: "",
		accessNode: "127.0.0.1:3569",
		contractsOwnerAddress: "",
		contracts: {
			"NonFungibleToken": "0x01cf0e2f2f715450",
			"FungibleToken": "0xee82856bf20e2aa6",
			"NFTPlus": "0x01cf0e2f2f715450",
			"CommonFee": "0x01cf0e2f2f715450",
			"CommonNFT": "0x01cf0e2f2f715450",
			"NFTStorefront": "0x01cf0e2f2f715450",
			"FlowToken": "0x0ae53cb6e3f42a79",
		},
	},
	testnet: {
		walletDiscovery: blocktoWallet,
		accessNode: "https://access-testnet.onflow.org",
		contractsOwnerAddress: testnetOwnerContractsAddress,
		contracts: {
			"NonFungibleToken": "0x631e88ae7f1d7c20",
			"FungibleToken": "0x9a0766d93b6608b7",
			"NFTPlus": "0x665b9acf64dfdfdb",
			"CommonFee": "0x665b9acf64dfdfdb",
			"CommonNFT": "0x665b9acf64dfdfdb",
			"NFTStorefront": "0x665b9acf64dfdfdb",
			"FlowToken": "0x7e60df042a9c0868",
		},
	},
	mainnet: {
		walletDiscovery: blocktoWallet,
		accessNode: "access.mainnet.nodes.onflow.org:9000",
		contractsOwnerAddress: "",
		contracts: {
			"NonFungibleToken": "0x01",
			"FungibleToken": "0x01",
			"NFTPlus": "0x01",
			"CommonFee": "0x01",
			"CommonNFT": "0x01",
			"NFTStorefront": "0x01",
			"FlowToken": "0x1654653399040a61",
		},
	},
}
