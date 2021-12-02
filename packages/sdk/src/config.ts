import type { FlowAddress } from "@rarible/types"
import { toFlowAddress } from "@rarible/types"
import type { FlowContractAddressName } from "./common/flow-address"
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
const EMULATOR_ADDRESS = toFlowAddress("0xf8d6e0586b0a20c7")

// todo move contracts address to fcl.config aliases  if it's possible
export const CONFIGS: Record<FlowNetwork, Config> = {
	emulator: {
		flowApiBasePath: "127.0.0.1:3569",
		walletDiscovery: "",
		accessNode: "127.0.0.1:3569",
		challengeHandshake: "",
		mainAddressMap: {
			NonFungibleToken: toFlowAddress(EMULATOR_ADDRESS),
			FungibleToken: toFlowAddress("0xee82856bf20e2aa6"),
			FlowToken: toFlowAddress("0x0ae53cb6e3f42a79"),
			FUSD: toFlowAddress(EMULATOR_ADDRESS),
			NFTStorefront: toFlowAddress(EMULATOR_ADDRESS),
			MotoGPCard: toFlowAddress(EMULATOR_ADDRESS),
			Evolution: toFlowAddress(EMULATOR_ADDRESS),
			TopShot: toFlowAddress(EMULATOR_ADDRESS),
			TopShotFee: toFlowAddress(EMULATOR_ADDRESS),
			RaribleFee: toFlowAddress(EMULATOR_ADDRESS),
			RaribleOrder: toFlowAddress(EMULATOR_ADDRESS),
			LicensedNFT: toFlowAddress(EMULATOR_ADDRESS),
			RaribleNFT: toFlowAddress(EMULATOR_ADDRESS),
		},
	},
	testnet: {
		flowApiBasePath: "https://flow-api-dev.rarible.com",
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
		flowApiBasePath: "https://flow-api.rarible.com",
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
	flowApiBasePath: string
	walletDiscovery: string
	accessNode: string
	challengeHandshake: string
	mainAddressMap: Record<FlowContractName, FlowAddress>
}

export enum EmulatorCollections {
	RARIBLE = "A.0xf8d6e0586b0a20c7.RaribleNFT",
	MOTOGP = "A.0xf8d6e0586b0a20c7.MotoGPCard",
	EVOLUTION = "A.0xf8d6e0586b0a20c7.Evolution",
	TOPSHOT = "A.0xf8d6e0586b0a20c7.TopShot",
}

export enum TestnetCollections {
	RARIBLE = "A.ebf4ae01d1284af8.RaribleNFT",
	MOTOGP = "A.01658d9b94068f3c.MotoGPCard",
	EVOLUTION = "A.01658d9b94068f3c.Evolution",
	TOPSHOT = "A.01658d9b94068f3c.TopShot",
}

export enum MainnetCollections {
	RARIBLE = "A.01ab36aaf654a13e.RaribleNFT",
	MOTOGP = "A.a49cc0ee46c54bfb.MotoGPCard",
	EVOLUTION = "A.f4264ac8f3256818.Evolution",
	TOPSHOT = "A.0b2a3299cc857e29.TopShot",
}

export const orderCodeConfig: Record<string,
{
	nftProviderPath: string
	collectionPath: string
	collectionPublicPath: string
	nftReceiver: string
	linkArg: string
}> = {
	TopShot: {
		nftProviderPath: "TopShotProviderForNFTStorefront",
		collectionPath: "/storage/MomentCollection",
		collectionPublicPath: "/public/MomentCollection",
		nftReceiver: "{TopShot.MomentCollectionPublic}",
		linkArg: "{TopShot.MomentCollectionPublic}",

	},
	Evolution: {
		nftProviderPath: "EvolutionProviderForNFTStorefront",
		collectionPath: "/storage/f4264ac8f3256818_Evolution_Collection",
		collectionPublicPath: "/public/f4264ac8f3256818_Evolution_Collection",
		nftReceiver: "{Evolution.EvolutionCollectionPublic}",
		linkArg: "{Evolution.EvolutionCollectionPublic}",
	},
	MotoGPCard: {
		nftProviderPath: "MotoGPCardProviderForNFTStorefront",
		collectionPath: "/storage/motogpCardCollection",
		collectionPublicPath: "/public/motogpCardCollection",
		nftReceiver: "MotoGPCard.Collection{MotoGPCard.ICardCollectionPublic}",
		linkArg: "MotoGPCard.Collection{MotoGPCard.ICardCollectionPublic}",
	},
	RaribleNFT: {
		nftProviderPath: "RaribleNFTProviderForNFTStorefront",
		collectionPath: "RaribleNFT.collectionStoragePath",
		collectionPublicPath: "RaribleNFT.collectionPublicPath",
		nftReceiver: "{NonFungibleToken.Receiver}",
		linkArg: "{NonFungibleToken.CollectionPublic,NonFungibleToken.Receiver}",
	},
}
