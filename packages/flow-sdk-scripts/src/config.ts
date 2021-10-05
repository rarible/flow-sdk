import { extractContractAddress } from "./utils/extract-contract-address"
import { CommonNft } from "./cadence/rarible/common-nft"
import { CommonNftOrder } from "./cadence/rarible/common-nft-order"
import { MotogpCardOrder } from "./cadence/motogp/motogp-card-order"
import { FlowAddress } from "./types/types"

export type AddressMap = { [key: string]: string }
export type Networks = "emulator" | "testnet" | "mainnet"

const blocktoWallet = "https://flow-wallet-testnet.blocto.app/authn"

type ConfigData = RaribleConfigData | MotoGpConfigData
type RaribleConfigData = {
	contractsNames: string[],
	mintable: true,
	transactions: {
		nft: typeof CommonNft
		order: typeof CommonNftOrder
	}
}

type MotoGpConfigData = {
	contractsNames: string[],
	mintable: false,
	transactions: {
		order: typeof MotogpCardOrder
	}
}

type CollectionByNetwork = Record<Networks, FlowAddress>

const raribleCollection: CollectionByNetwork = {
	emulator: "0x01cf0e2f2f715450",
	testnet: "0x665b9acf64dfdfdb",
	mainnet: "0x0",
}

const raribleConfigData: ConfigData = {
	contractsNames: ["NFTPlus", "CommonFee", "CommonNFT", "NFTStorefront"],
	mintable: true,
	transactions: {
		order: CommonNftOrder,
		nft: CommonNft,
	},
}

const motoGpCollection: CollectionByNetwork = {
	emulator: "0x01",
	testnet: "0x02",
	mainnet: "0x03",
}

const motoGPConfigData: ConfigData = {
	contractsNames: ["NFTPlus", "CommonFee", "CommonNFT", "NFTStorefront"],
	mintable: false,
	transactions: {
		order: MotogpCardOrder,
	},
}

type Config = {
	walletDiscovery: string,
	accessNode: string,
	collections: Record<FlowAddress, ConfigData>
	mainAddressMap: { [key: string]: FlowAddress }
}

export const CONFIGS: Record<Networks, Config> = {
	emulator: {
		walletDiscovery: "",
		accessNode: "127.0.0.1:3569",
		collections: {
			[raribleCollection.emulator]: raribleConfigData,
			[motoGpCollection.emulator]: motoGPConfigData,
		},
		mainAddressMap: {
			"NonFungibleToken": "0x01cf0e2f2f715450",
			"FungibleToken": "0xee82856bf20e2aa6",
			"FlowToken": "0x0ae53cb6e3f42a79",
		},
	},
	testnet: {
		walletDiscovery: blocktoWallet,
		accessNode: "https://access-testnet.onflow.org",
		collections: {
			[raribleCollection.testnet]: raribleConfigData,
			[motoGpCollection.testnet]: motoGPConfigData,
		},
		mainAddressMap: {
			"NonFungibleToken": "0x631e88ae7f1d7c20",
			"FungibleToken": "0x9a0766d93b6608b7",
			"FlowToken": "0x7e60df042a9c0868",
		},
	},
	mainnet: {
		walletDiscovery: blocktoWallet,
		accessNode: "access.mainnet.nodes.onflow.org:9000",
		collections: {
			[raribleCollection.mainnet]: raribleConfigData,
			[motoGpCollection.mainnet]: motoGPConfigData,
		},
		mainAddressMap: {
			"NonFungibleToken": "0x01",
			"FungibleToken": "0x01",
			"FlowToken": "0x1654653399040a61",
		},
	},
}

type GetContractsAddressMap = {
	addressMap: AddressMap,
	collectionAddress: FlowAddress,
	collectionConfig: ConfigData
}

export function getCollectionConfig(network: Networks, collection: string): GetContractsAddressMap {
	try {
		const collectionAddress = extractContractAddress(collection)
		const map: AddressMap = {}
		CONFIGS[network].collections[collectionAddress].contractsNames.forEach(k => {
			map[k] = collectionAddress
		})
		return {
			addressMap: Object.assign(map, CONFIGS[network].mainAddressMap),
			collectionAddress,
			collectionConfig: CONFIGS[network].collections[collectionAddress],
		}
	} catch (e) {
		throw Error(`Wrong collection: ${e}`)
	}
}
