import type { FlowAddress, FlowContractAddressName } from "./common/flow-address"
import { toFlowAddress } from "./common/flow-address"
import type { FlowContractName, FlowNetwork } from "./types"

export const MIN_ORDER_PRICE = "0.0001"

type BlocktoWalletData = {
	accessNode: string
	wallet: string
}

const blocktoWallet: Record<FlowNetwork, BlocktoWalletData> = {
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

export type FlowConfigData = {
	/**
	 * additional contracts deployed in main collection
	 */
	contractsNames: FlowContractAddressName[]
	/**
	 * is mint/burn/transfer avaliable in collection
	 */
	mintable: boolean
}

export const flowCollectionsConfig: Record<string, FlowConfigData> = {
	RaribleNFT: {
		contractsNames: ["RaribleOrder", "RaribleNFT", "LicensedNFT", "RaribleFee"] as FlowContractAddressName[],
		mintable: true,
	},
	MotoGPCard: {
		contractsNames: ["MotoGPCard"] as FlowContractAddressName[],
		mintable: false,
	},
	Evolution: {
		contractsNames: ["Evolution"] as FlowContractAddressName[],
		mintable: false,
	},
	TopShot: {
		contractsNames: ["TopShot"] as FlowContractAddressName[],
		mintable: false,
	},
}

const MAINNET_RARIBLE_ADDRESS = toFlowAddress("0x01ab36aaf654a13e")
const TESTNET_RARIBLE_ADDRESS = toFlowAddress("0xebf4ae01d1284af8")

// todo move contracts address to fcl.config aliases  if it's possible
export const CONFIGS: Record<FlowNetwork, Config> = {
	emulator: {
		walletDiscovery: "",
		accessNode: "127.0.0.1:3569",
		challengeHandshake: "",
		mainAddressMap: {
			NonFungibleToken: toFlowAddress("0x01cf0e2f2f715450"),
			FungibleToken: toFlowAddress("0xee82856bf20e2aa6"),
			FlowToken: toFlowAddress("0x0ae53cb6e3f42a79"),
			FUSD: toFlowAddress("0x01cf0e2f2f715450"),
			NFTStorefront: toFlowAddress("0x01cf0e2f2f715450"),
			MotoGPCard: toFlowAddress("0x01cf0e2f2f715450"),
			Evolution: toFlowAddress("0x01cf0e2f2f715450"),
			TopShot: toFlowAddress("0x01cf0e2f2f715450"),
			TopShotFee: toFlowAddress("0x01cf0e2f2f715450"),
			RaribleFee: toFlowAddress("0x01cf0e2f2f715450"),
			RaribleOrder: toFlowAddress("0x01cf0e2f2f715450"),
			LicensedNFT: toFlowAddress("0x01cf0e2f2f715450"),
			RaribleNFT: toFlowAddress("0x01cf0e2f2f715450"),
		},
	},
	testnet: {
		walletDiscovery: "",
		accessNode: blocktoWallet.testnet.accessNode,
		challengeHandshake: blocktoWallet.testnet.wallet,
		mainAddressMap: {
			NonFungibleToken: toFlowAddress("0x631e88ae7f1d7c20"),
			FungibleToken: toFlowAddress("0x9a0766d93b6608b7"),
			FUSD: toFlowAddress("0xe223d8a629e49c68"),
			FlowToken: toFlowAddress("0x7e60df042a9c0868"),
			NFTStorefront: toFlowAddress("0x94b06cfca1d8a476"),
			MotoGPCard: toFlowAddress("0x01658d9b94068f3c"),
			Evolution: toFlowAddress("0x01658d9b94068f3c"),
			TopShot: toFlowAddress("0x01658d9b94068f3c"),
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
			NonFungibleToken: toFlowAddress("0x1d7e57aa55817448"),
			FungibleToken: toFlowAddress("0xf233dcee88fe0abe"),
			FUSD: toFlowAddress("0x3c5959b568896393"),
			FlowToken: toFlowAddress("0x1654653399040a61"),
			NFTStorefront: toFlowAddress("0x4eb8a10cb9f87357"),
			MotoGPCard: toFlowAddress("0xa49cc0ee46c54bfb"),
			Evolution: toFlowAddress("0xf4264ac8f3256818"),
			TopShot: toFlowAddress("0b2a3299cc857e29"),
			TopShotFee: toFlowAddress("0xbd69b6abdfcf4539"),
			RaribleFee: MAINNET_RARIBLE_ADDRESS,
			RaribleOrder: MAINNET_RARIBLE_ADDRESS,
			RaribleNFT: MAINNET_RARIBLE_ADDRESS,
			LicensedNFT: MAINNET_RARIBLE_ADDRESS,
		},
	},
}

type Config = {
	walletDiscovery: string
	accessNode: string
	challengeHandshake: string
	mainAddressMap: Record<FlowContractName, FlowAddress>
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
