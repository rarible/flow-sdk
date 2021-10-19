import { CollectionName, FlowAddress } from "./types"

const blocktoWallet: BlocktoWallet = {
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
//todo update all contracts addresses, update contracts lists for collections
const raribleConfigData: ConfigData = {
	contractsNames: ["NFTPlus", "CommonFee", "CommonNFT", "NFTStorefront"],
	mintable: true,
}

const motoGPConfigData: ConfigData = {
	contractsNames: ["NFTPlus", "CommonFee", "CommonNFT", "NFTStorefront"],
	mintable: false,
}

const evolutionConfigData: ConfigData = {
	contractsNames: ["NFTPlus", "CommonFee", "CommonNFT", "NFTStorefront"],
	mintable: false,
}

const topShotConfigData: ConfigData = {
	contractsNames: ["NFTPlus", "CommonFee", "CommonNFT", "NFTStorefront"],
	mintable: false,
}

export const collectionsConfig: Record<CollectionName, ConfigData> = {
	CommonNFT: raribleConfigData,
	Rarible: raribleConfigData,
	MotoGPCard: motoGPConfigData,
	Evolution: evolutionConfigData,
	TopShot: topShotConfigData,
}

export const CONFIGS: Record<Networks, Config> = {
	emulator: {
		walletDiscovery: "",
		accessNode: "127.0.0.1:3569",
		challengeHandshake: "",
		mainAddressMap: {//todo
			"NonFungibleToken": "0x01cf0e2f2f715450",
			"FungibleToken": "0xee82856bf20e2aa6",
			"FlowToken": "0x0ae53cb6e3f42a79",
			"FUSD": "0x01cf0e2f2f715450",
		},
	},
	testnet: {
		walletDiscovery: "",
		accessNode: blocktoWallet.testnet.accessNode,
		challengeHandshake: blocktoWallet.testnet.wallet,
		mainAddressMap: {//todo
			"NonFungibleToken": "0x631e88ae7f1d7c20",
			"FungibleToken": "0x9a0766d93b6608b7",
			"FUSD": "0xe223d8a629e49c68",
			"FlowToken": "0x7e60df042a9c0868",
		},
	},
	mainnet: {
		walletDiscovery: "",
		accessNode: blocktoWallet.mainnet.accessNode,
		challengeHandshake: blocktoWallet.mainnet.wallet,
		mainAddressMap: {//todo
			"NonFungibleToken": "0x1d7e57aa55817448",
			"FungibleToken": "0xf233dcee88fe0abe",
			"FUSD": "0x3c5959b568896393",
			"FlowToken": "0x1654653399040a61",
		},
	},
}

export type AddressMap = { [key: string]: string }
export type Networks = "emulator" | "testnet" | "mainnet"
export type BlocktoWallet = Record<Networks, {
	accessNode: string
	wallet: string
}>

type Config = {
	walletDiscovery: string,
	accessNode: string,
	challengeHandshake: string,
	mainAddressMap: { [key: string]: FlowAddress }
}

export type ConfigData = {
	contractsNames: string[],
	mintable: boolean,
}

export enum EmulatorCollections {
	RARIBLE = "A.0x01cf0e2f2f715450.CommonNFT",
	MOTOGP = "A.0x01cf0e2f2f715450.MotoGPCard",
	EVOLUTION = "A.0x01cf0e2f2f715450.Evolution",
	TOPSHOT = "A.0x01cf0e2f2f715450.TopShot",
}

export enum TestnetCollections {
	RARIBLE = "A.0x01658d9b94068f3c.CommonNFT",
	MOTOGP = "A.0x01658d9b94068f3c.MotoGPCard",
	EVOLUTION = "A.0x01658d9b94068f3c.Evolution",
	TOPSHOT = "A.0x01658d9b94068f3c.TopShot",
}

export enum MainnetCollections {
	RARIBLE = "A.0x0.Rarible",
	MOTOGP = "A.0xa49cc0ee46c54bfb.MotoGPCard",
	EVOLUTION = "A.f4264ac8f3256818.Evolution",
	TOPSHOT = "A.0b2a3299cc857e29.TopShot",
}

export type Collection =
	MainnetCollections.RARIBLE |
	MainnetCollections.MOTOGP |
	MainnetCollections.EVOLUTION |
	MainnetCollections.TOPSHOT |
	TestnetCollections.RARIBLE |
	TestnetCollections.MOTOGP |
	TestnetCollections.EVOLUTION |
	TestnetCollections.TOPSHOT |
	EmulatorCollections.RARIBLE |
	EmulatorCollections.MOTOGP |
	EmulatorCollections.EVOLUTION |
	EmulatorCollections.TOPSHOT
