import type { BigNumber, FlowAddress } from "@rarible/types"
import { toBigNumber, toFlowAddress, ZERO_ADDRESS } from "@rarible/types"
import type { FlowContractAddressName } from "../common/flow-address"
import type { FlowContractName, FlowFee, FlowNetwork } from "../types"

export const MIN_ORDER_PRICE = "0.0001"
export type FlowNftFeatures = "MINT" | "BURN" | "TRANSFER"
export type FlowConfigData = {
	/**
	 * additional contracts deployed in main collection
	 */
	contractsNames: FlowContractAddressName[]
	/**
	 * is mint/burn/transfer avaliable in collection
	 */
	features: FlowNftFeatures[]
}

export const flowCollectionsConfig: Record<string, FlowConfigData> = {
	RaribleNFT: {
		contractsNames: ["RaribleOrder", "RaribleNFT", "LicensedNFT", "RaribleFee"] as FlowContractAddressName[],
		features: ["MINT", "TRANSFER", "BURN"],
	},
	MotoGPCard: {
		contractsNames: ["MotoGPCard"] as FlowContractAddressName[],
		features: ["TRANSFER", "BURN"],
	},
	Evolution: {
		contractsNames: ["Evolution"] as FlowContractAddressName[],
		features: ["TRANSFER", "BURN"],
	},
	TopShot: {
		contractsNames: ["TopShot"] as FlowContractAddressName[],
		features: ["TRANSFER", "BURN"],
	},
	MugenNFT: {
		contractsNames: ["MugenNFT"] as FlowContractAddressName[],
		features: ["TRANSFER"],
	},
	CNN_NFT: {
		contractsNames: ["CNN_NFT"] as FlowContractAddressName[],
		features: ["TRANSFER", "BURN"],
	},
	MatrixWorldFlowFestNFT: {
		contractsNames: ["MatrixWorldFlowFestNFT"] as FlowContractAddressName[],
		features: ["TRANSFER", "BURN"],
	},
	MatrixWorldVoucher: {
		contractsNames: ["MatrixWorldVoucher"] as FlowContractAddressName[],
		features: ["TRANSFER", "BURN"],
	},
}

const MAINNET_RARIBLE_ADDRESS = toFlowAddress("0x01ab36aaf654a13e")
const TESTNET_RARIBLE_ADDRESS = toFlowAddress("0xebf4ae01d1284af8")
const EMULATOR_ADDRESS = toFlowAddress("0xf8d6e0586b0a20c7")

// protocol fee in base points
const PROTOCOL_FEE: BigNumber = toBigNumber("0")


// todo move contracts address to fcl.config aliases  if it's possible
export const CONFIGS: Record<FlowNetwork, Config> = {
	emulator: {
		lastWithHardcodedOriginalFeesOrderNum: -1,
		protocolFee: { account: EMULATOR_ADDRESS, value: PROTOCOL_FEE },
		mainAddressMap: {
			NonFungibleToken: EMULATOR_ADDRESS,
			FungibleToken: toFlowAddress("0xee82856bf20e2aa6"),
			FlowToken: toFlowAddress("0x0ae53cb6e3f42a79"),
			FUSD: EMULATOR_ADDRESS,
			NFTStorefront: EMULATOR_ADDRESS,
			MotoGPCard: EMULATOR_ADDRESS,
			Evolution: EMULATOR_ADDRESS,
			TopShot: EMULATOR_ADDRESS,
			TopShotFee: EMULATOR_ADDRESS,
			RaribleFee: EMULATOR_ADDRESS,
			RaribleOrder: EMULATOR_ADDRESS,
			LicensedNFT: EMULATOR_ADDRESS,
			RaribleNFT: EMULATOR_ADDRESS,
			RaribleOpenBid: EMULATOR_ADDRESS,
			MugenNFT: EMULATOR_ADDRESS,
			CNN_NFT: EMULATOR_ADDRESS,
			MatrixWorldFlowFestNFT: EMULATOR_ADDRESS,
			MatrixWorldVoucher: EMULATOR_ADDRESS,
		},
	},
	testnet: {
		lastWithHardcodedOriginalFeesOrderNum: 23805857,
		protocolFee: { account: TESTNET_RARIBLE_ADDRESS, value: PROTOCOL_FEE },
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
			RaribleOpenBid: toFlowAddress("0x1d56d7ba49283a88"),
			MugenNFT: TESTNET_RARIBLE_ADDRESS,
			CNN_NFT: TESTNET_RARIBLE_ADDRESS,
			MatrixWorldFlowFestNFT: toFlowAddress("0xe2f1b000e0203c1d"),
			MatrixWorldVoucher: toFlowAddress(ZERO_ADDRESS),
		},
	},
	mainnet: {
		lastWithHardcodedOriginalFeesOrderNum: 102307310,
		protocolFee: { account: toFlowAddress("0x7f599d6dd7fd7e7b"), value: PROTOCOL_FEE },
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
			RaribleOpenBid: MAINNET_RARIBLE_ADDRESS,
			MugenNFT: toFlowAddress("0x2cd46d41da4ce262"),
			CNN_NFT: toFlowAddress("0x329feb3ab062d289"),
			MatrixWorldFlowFestNFT: toFlowAddress("0x2d2750f240198f91"),
			MatrixWorldVoucher: toFlowAddress("0x0d77ec47bbad8ef6"),
		},
	},
}

type Config = {
	protocolFee: FlowFee,
	lastWithHardcodedOriginalFeesOrderNum: number
	mainAddressMap: Record<FlowContractName, FlowAddress>
}

export enum EmulatorCollections {
	RARIBLE = "A.0xf8d6e0586b0a20c7.RaribleNFT",
	MOTOGP = "A.0xf8d6e0586b0a20c7.MotoGPCard",
	EVOLUTION = "A.0xf8d6e0586b0a20c7.Evolution",
	TOPSHOT = "A.0xf8d6e0586b0a20c7.TopShot",
	MUGENNFT = "A.0xf8d6e0586b0a20c7.MugenNFT",
	CNNNFT = "A.0xf8d6e0586b0a20c7.CNN_NFT",
	MATRIXFEST = "A.0xf8d6e0586b0a20c7.MatrixWorldFlowFestNFT",
	MATRIXLANDVAUCHER = "A.0xf8d6e0586b0a20c7.MatrixWorldVoucher"
}

export enum TestnetCollections {
	RARIBLE = "A.ebf4ae01d1284af8.RaribleNFT",
	MOTOGP = "A.01658d9b94068f3c.MotoGPCard",
	EVOLUTION = "A.01658d9b94068f3c.Evolution",
	TOPSHOT = "A.01658d9b94068f3c.TopShot",
	MUGENNFT = "A.ebf4ae01d1284af8.MugenNFT",
	CNNNFT = "A.ebf4ae01d1284af8.CNN_NFT",
	MATRIXFEST = "A.e2f1b000e0203c1d.MatrixWorldFlowFestNFT",
}

export enum MainnetCollections {
	RARIBLE = "A.01ab36aaf654a13e.RaribleNFT",
	MOTOGP = "A.a49cc0ee46c54bfb.MotoGPCard",
	EVOLUTION = "A.f4264ac8f3256818.Evolution",
	TOPSHOT = "A.0b2a3299cc857e29.TopShot",
	MUGENNFT = "A.2cd46d41da4ce262.MugenNFT",
	CNNNFT = "A.329feb3ab062d289.CNN_NFT",
	MATRIXFEST = "A.2d2750f240198f91.MatrixWorldFlowFestNFT",
	MATRIXLANDVAUCHER = "A.0d77ec47bbad8ef6.MatrixWorldVoucher"
}
