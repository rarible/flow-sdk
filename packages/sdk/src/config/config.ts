import type { BigNumber, FlowAddress } from "@rarible/types"
import { toBigNumber, toFlowAddress, ZERO_ADDRESS } from "@rarible/types"
import type { FlowContractName, FlowFee, FlowNetwork, NonFungibleContract } from "../types"

export const NODE_HTTP_TRANSPORT_CONFIG: Record<FlowNetwork, string> = {
	emulator: "http://localhost:8888",
	testnet: "https://rest-testnet.onflow.org",
	mainnet: "https://rest-mainnet.onflow.org",
}

export const NODE_GRPC_TRANSPORT_CONFIG: Record<FlowNetwork, string> = {
	emulator: "http://localhost:8888",
	testnet: "https://access-testnet.onflow.org",
	mainnet: "https://access-mainnet-beta.onflow.org",
}

export const METADATA_HOST = "https://gateway.pinata.cloud"
export const MIN_ORDER_PRICE = "0.0001"

const MAINNET_RARIBLE_ADDRESS = toFlowAddress("0x01ab36aaf654a13e")
const TESTNET_RARIBLE_ADDRESS = toFlowAddress("0xebf4ae01d1284af8")
const EMULATOR_ADDRESS = toFlowAddress("0xf8d6e0586b0a20c7")

// protocol fee in base points
const PROTOCOL_FEE: BigNumber = toBigNumber("0")

// todo move contracts address to fcl.config aliases  if it's possible
export const CONFIGS: Record<FlowNetwork, Config> = {
	emulator: {
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
			EnglishAuction: EMULATOR_ADDRESS,
			MugenNFT: EMULATOR_ADDRESS,
			CNN_NFT: EMULATOR_ADDRESS,
			MatrixWorldFlowFestNFT: EMULATOR_ADDRESS,
			MatrixWorldVoucher: EMULATOR_ADDRESS,
			MetadataViews: EMULATOR_ADDRESS,
			SoftCollection: EMULATOR_ADDRESS,
			RaribleNFTv2: EMULATOR_ADDRESS,
			DisruptArt: EMULATOR_ADDRESS,
			Art: EMULATOR_ADDRESS,
			StarlyCard: EMULATOR_ADDRESS,
			OneFootballCollectible: EMULATOR_ADDRESS,
			ChainmonstersRewards: EMULATOR_ADDRESS,
			BarterYardPackNFT: EMULATOR_ADDRESS,
			Moments: EMULATOR_ADDRESS,
			FanfareNFTContract: EMULATOR_ADDRESS,
			Kicks: EMULATOR_ADDRESS,
		},
	},
	testnet: {
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
			EnglishAuction: TESTNET_RARIBLE_ADDRESS,
			MugenNFT: TESTNET_RARIBLE_ADDRESS,
			CNN_NFT: TESTNET_RARIBLE_ADDRESS,
			MatrixWorldFlowFestNFT: toFlowAddress("0xe2f1b000e0203c1d"),
			MatrixWorldVoucher: toFlowAddress(ZERO_ADDRESS),
			MetadataViews: toFlowAddress("0x631e88ae7f1d7c20"),
			SoftCollection: TESTNET_RARIBLE_ADDRESS,
			RaribleNFTv2: TESTNET_RARIBLE_ADDRESS,
			DisruptArt: TESTNET_RARIBLE_ADDRESS,
			Art: TESTNET_RARIBLE_ADDRESS,
			StarlyCard: TESTNET_RARIBLE_ADDRESS,
			OneFootballCollectible: TESTNET_RARIBLE_ADDRESS,
			ChainmonstersRewards: TESTNET_RARIBLE_ADDRESS,
			BarterYardPackNFT: toFlowAddress("0x4300fc3a11778a9a"),
			Moments: TESTNET_RARIBLE_ADDRESS,
			FanfareNFTContract: TESTNET_RARIBLE_ADDRESS,
			Kicks: TESTNET_RARIBLE_ADDRESS,
		},
	},
	mainnet: {
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
			EnglishAuction: MAINNET_RARIBLE_ADDRESS,
			MugenNFT: toFlowAddress("0x2cd46d41da4ce262"),
			CNN_NFT: toFlowAddress("0x329feb3ab062d289"),
			MatrixWorldFlowFestNFT: toFlowAddress("0x2d2750f240198f91"),
			MatrixWorldVoucher: toFlowAddress("0x0d77ec47bbad8ef6"),
			MetadataViews: toFlowAddress("0x1d7e57aa55817448"),
			SoftCollection: MAINNET_RARIBLE_ADDRESS,
			RaribleNFTv2: MAINNET_RARIBLE_ADDRESS,
			DisruptArt: toFlowAddress("0xcd946ef9b13804c6"),
			Art: toFlowAddress("0xd796ff17107bbff6"),
			StarlyCard: toFlowAddress("0x5b82f21c0edf76e3"),
			OneFootballCollectible: toFlowAddress("0x6831760534292098"),
			ChainmonstersRewards: toFlowAddress("0x93615d25d14fa337"),
			BarterYardPackNFT: toFlowAddress("0xa95b021cf8a30d80"),
			Moments: toFlowAddress("0xd4ad4740ee426334"),
			FanfareNFTContract: toFlowAddress("0xe3d6aefbdc74f65f"),
			Kicks: toFlowAddress("0xf3cc54f4d91c2f6c"),
		},
	},
}

type Config = {
	protocolFee: FlowFee,
	mainAddressMap: Record<FlowContractName, FlowAddress>
}

export type FlowNftFeatures = "MINT" | "BURN" | "TRANSFER"
export type FlowConfigData = { features: FlowNftFeatures[] }

export const flowCollectionsConfig: Record<NonFungibleContract, FlowConfigData> = {
	RaribleNFT: {
		features: ["MINT", "TRANSFER", "BURN"],
	},
	MotoGPCard: {
		features: ["TRANSFER", "BURN"],
	},
	Evolution: {
		features: ["TRANSFER", "BURN"],
	},
	TopShot: {
		features: ["TRANSFER", "BURN"],
	},
	MugenNFT: {
		features: ["TRANSFER"],
	},
	CNN_NFT: {
		features: ["TRANSFER", "BURN"],
	},
	MatrixWorldFlowFestNFT: {
		features: ["TRANSFER", "BURN"],
	},
	MatrixWorldVoucher: {
		features: ["TRANSFER", "BURN"],
	},
	SoftCollection: {
		features: ["TRANSFER", "BURN", "MINT"],
	},
	RaribleNFTv2: {
		features: ["TRANSFER", "BURN", "MINT"],
	},
	DisruptArt: {
		features: ["TRANSFER", "BURN"],
	},
	Art: {
		features: ["TRANSFER", "BURN"],
	},
	StarlyCard: {
		features: ["TRANSFER", "BURN"],
	},
	OneFootballCollectible: {
		features: ["TRANSFER", "BURN"],
	},
	ChainmonstersRewards: {
		features: ["TRANSFER", "BURN"],
	},
	BarterYardPackNFT: {
		features: ["TRANSFER", "BURN"],
	},
	FanfareNFTContract: {
		features: ["TRANSFER", "BURN"],
	},
	Kicks: {
		features: ["TRANSFER", "BURN"],
	},
	Moments: {
		features: ["TRANSFER", "BURN"],
	},
}
