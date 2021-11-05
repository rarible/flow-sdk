import type { CollectionName, FlowAddress } from "./types"

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

/*
 * contractsNames - additional contracts deployed in main collection
 * mintable - ia mint/burn/transfer avaliable in collection
 */
const raribleConfigData: ConfigData = {
	contractsNames: ["RaribleOrder", "RaribleNFT", "LicensedNFT", "RaribleFee"],
	mintable: true,
}

const motoGPConfigData: ConfigData = {
	contractsNames: ["MotoGPCard"],
	mintable: false,
}

const evolutionConfigData: ConfigData = {
	contractsNames: ["Evolution"],
	mintable: false,
}

const topShotConfigData: ConfigData = {
	contractsNames: ["TopShot"],
	mintable: false,
}

export const collectionsConfig: Record<CollectionName, ConfigData> = {
	RaribleNFT: raribleConfigData,
	MotoGPCard: motoGPConfigData,
	Evolution: evolutionConfigData,
	TopShot: topShotConfigData,
}

const MAINNET_RARIBLE_ADDRESS = "0x01ab36aaf654a13e"
const TESTNET_RARIBLE_ADDRESS = "0xebf4ae01d1284af8"
// todo move contracts address to fcl.config aliases  if it's possible
export const CONFIGS: Record<Networks, Config> = {
	emulator: {
		walletDiscovery: "",
		accessNode: "127.0.0.1:3569",
		challengeHandshake: "",
		mainAddressMap: {
			NonFungibleToken: "0x01cf0e2f2f715450",
			FungibleToken: "0xee82856bf20e2aa6",
			FlowToken: "0x0ae53cb6e3f42a79",
			FUSD: "0x01cf0e2f2f715450",
			NFTStorefront: "0x01cf0e2f2f715450",
			MotoGPCard: "0x01cf0e2f2f715450",
			Evolution: "0x01cf0e2f2f715450",
			TopShot: "0x01cf0e2f2f715450",
			TopShotFee: "0x01cf0e2f2f715450",
			RaribleFee: "0x01cf0e2f2f715450",
			RaribleOrder: "0x01cf0e2f2f715450",
			LicensedNFT: "0x01cf0e2f2f715450",
			RaribleNFT: "0x01cf0e2f2f715450",
		},
	},
	testnet: {
		walletDiscovery: "",
		accessNode: blocktoWallet.testnet.accessNode,
		challengeHandshake: blocktoWallet.testnet.wallet,
		mainAddressMap: {
			NonFungibleToken: "0x631e88ae7f1d7c20",
			FungibleToken: "0x9a0766d93b6608b7",
			FUSD: "0xe223d8a629e49c68",
			FlowToken: "0x7e60df042a9c0868",
			NFTStorefront: "0x94b06cfca1d8a476",
			MotoGPCard: "0x01658d9b94068f3c",
			Evolution: "0x01658d9b94068f3c",
			TopShot: "0x01658d9b94068f3c",
			TopShotFee: TESTNET_RARIBLE_ADDRESS,
			RaribleFee: TESTNET_RARIBLE_ADDRESS,
			RaribleOrder: TESTNET_RARIBLE_ADDRESS,
			RaribleNFT: TESTNET_RARIBLE_ADDRESS,
			LicensedNFT: TESTNET_RARIBLE_ADDRESS,
		},
	},
	mainnet: {
		walletDiscovery: "",
		accessNode: blocktoWallet.mainnet.accessNode,
		challengeHandshake: blocktoWallet.mainnet.wallet,
		mainAddressMap: {
			NonFungibleToken: "0x1d7e57aa55817448",
			FungibleToken: "0xf233dcee88fe0abe",
			FUSD: "0x3c5959b568896393",
			FlowToken: "0x1654653399040a61",
			NFTStorefront: "0x4eb8a10cb9f87357",
			MotoGPCard: "0xa49cc0ee46c54bfb",
			Evolution: "0xf4264ac8f3256818",
			TopShot: "0b2a3299cc857e29",
			TopShotFee: "0xbd69b6abdfcf4539",
			RaribleFee: MAINNET_RARIBLE_ADDRESS,
			RaribleOrder: MAINNET_RARIBLE_ADDRESS,
			RaribleNFT: MAINNET_RARIBLE_ADDRESS,
			LicensedNFT: MAINNET_RARIBLE_ADDRESS,
		},
	},
}

export type AddressMap = { [key: string]: string }
export type Networks = "emulator" | "testnet" | "mainnet"
export type BlocktoWallet = Record<Networks, {
	accessNode: string
	wallet: string
}>
type Contracts =
	"NonFungibleToken"
	| "FungibleToken"
	| "FUSD"
	| "FlowToken"
	| "NFTStorefront"
	| "MotoGPCard"
	| "Evolution"
	| "TopShot"
	| "RaribleFee"
	| "RaribleOrder"
	| "RaribleNFT"
	| "LicensedNFT"
	| "TopShotFee"
type Config = {
	walletDiscovery: string,
	accessNode: string,
	challengeHandshake: string,
	mainAddressMap: Record<Contracts, FlowAddress>
}

export type ConfigData = {
	contractsNames: string[],
	mintable: boolean,
}

export enum EmulatorCollections {
	RARIBLE = "A.0x01cf0e2f2f715450.RaribleNFT",
	MOTOGP = "A.0x01cf0e2f2f715450.MotoGPCard",
	EVOLUTION = "A.0x01cf0e2f2f715450.Evolution",
	TOPSHOT = "A.0x01cf0e2f2f715450.TopShot",
}

export enum TestnetCollections {
	RARIBLE = "A.0xebf4ae01d1284af8.RaribleNFT",
	MOTOGP = "A.0x01658d9b94068f3c.MotoGPCard",
	EVOLUTION = "A.0x01658d9b94068f3c.Evolution",
	TOPSHOT = "A.0x01658d9b94068f3c.TopShot",
}

export enum MainnetCollections {
	RARIBLE = "A.0x01ab36aaf654a13e.RaribleNFT",
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
