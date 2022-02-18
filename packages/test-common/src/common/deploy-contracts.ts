import { deployContractByName } from "flow-js-testing"
import { CONTRACTS, EMULATOR_FUNGIBLE_TOKEN_ADDRESS } from "../config"

export async function deployAll(address: string) {
	await deployContractByName({
		name: CONTRACTS.NonFungibleToken,
		to: address,
	})

	await deployContractByName({
		name: CONTRACTS.FUSD,
		to: address,
		addressMap: {
			NonFungibleToken: address,
		},
	})
	await deployContractByName({
		name: CONTRACTS.RaribleFee,
		to: address,
	})
	await deployContractByName({
		name: CONTRACTS.LicensedNFT,
		to: address,
	})
	await deployContractByName({
		name: CONTRACTS.RaribleNFT,
		to: address,
		addressMap: {
			NonFungibleToken: address,
			LicensedNFT: address,
		},
	})
	await deployContractByName({
		name: CONTRACTS.NFTStorefront,
		to: address,
		addressMap: {
			NonFungibleToken: address,
		},
	})
	await deployContractByName({
		name: CONTRACTS.RaribleOrder,
		to: address,
		addressMap: {
			RaribleFee: address,
			NFTStorefront: address,
			NonFungibleToken: address,
		},
	})
	await deployContractByName({
		name: CONTRACTS.Evolution,
		to: address,
		addressMap: {
			NonFungibleToken: address,
		},
	})
	await deployContractByName({
		name: CONTRACTS.TopShot,
		to: address,
		addressMap: {
			NonFungibleToken: address,
		},
	})
	await deployContractByName({
		name: CONTRACTS.MotoGPPack,
		to: address,
		addressMap: {
			NonFungibleToken: address,
		},
	})
	await deployContractByName({
		name: CONTRACTS.MotoGPAdmin,
		to: address,
		addressMap: {
			MotoGPPack: address,
		},
	})
	await deployContractByName({
		name: CONTRACTS.ContractVersion,
		to: address,
	})
	await deployContractByName({
		name: CONTRACTS.MotoGPCardMetadata,
		to: address,
		addressMap: {
			MotoGPAdmin: address,
			ContractVersion: address,
		},
	})
	await deployContractByName({
		name: CONTRACTS.MotoGPCounter,
		to: address,
		addressMap: {
			MotoGPAdmin: address,
			ContractVersion: address,
		},
	})
	await deployContractByName({
		name: CONTRACTS.MotoGPCard,
		to: address,
		addressMap: {
			NonFungibleToken: address,
			MotoGPAdmin: address,
			MotoGPCardMetadata: address,
			MotoGPCounter: address,
		},
	})
	await deployContractByName({
		name: CONTRACTS.PackOpener,
		to: address,
		addressMap: {
			MotoGPAdmin: address,
			MotoGPPack: address,
			MotoGPCard: address,
			NonFungibleToken: address,
			ContractVersion: address,
		},
	})
	await deployContractByName({
		name: CONTRACTS.MotoGPTransfer,
		to: address,
		addressMap: {
			FlowToken: "0x0ae53cb6e3f42a79",
			MotoGPAdmin: address,
			MotoGPPack: address,
			MotoGPCard: address,
			NonFungibleToken: address,
			FungibleToken: EMULATOR_FUNGIBLE_TOKEN_ADDRESS,
			FlowStorageFees: address,
			ContractVersion: address,
			PackOpener: address,
		},
	})
	await deployContractByName({
		name: CONTRACTS.RaribleOpenBid,
		to: address,
		addressMap: {
			NonFungibleToken: address,
			FungibleToken: EMULATOR_FUNGIBLE_TOKEN_ADDRESS,
		},
	})
	await deployContractByName({
		name: CONTRACTS.MugenNFT,
		to: address,
		addressMap: {
			NonFungibleToken: address,
		},
	})
	await deployContractByName({
		name: CONTRACTS.CNN_NFT,
		to: address,
		addressMap: {
			NonFungibleToken: address,
		},
	})
	await deployContractByName({
		name: CONTRACTS.EnglishAuction,
		to: address,
		addressMap: {
			NonFungibleToken: address,
			FungibleToken: EMULATOR_FUNGIBLE_TOKEN_ADDRESS,
		},
	})
	await deployContractByName({
		name: CONTRACTS.MatrixWorldFlowFestNFT,
		to: address,
		addressMap: {
			NonFungibleToken: address,
		},
	})
	await deployContractByName({
		name: CONTRACTS.MatrixWorldVoucher,
		to: address,
		addressMap: {
			NonFungibleToken: address,
		},
	})
	await deployContractByName({
		name: CONTRACTS.Content,
		to: address,
		addressMap: {},
	})
	await deployContractByName({
		name: CONTRACTS.Art,
		to: address,
		addressMap: {
			NonFungibleToken: address,
			FungibleToken: "0xee82856bf20e2aa6",
			Content: address,
		},
	})
	await deployContractByName({
		name: CONTRACTS.ChainmonstersRewards,
		to: address,
		addressMap: {
			NonFungibleToken: address,
		},
	})
	await deployContractByName({
		name: CONTRACTS.StarlyCard,
		to: address,
		addressMap: {
			NonFungibleToken: address,
		},
	})
	await deployContractByName({
		name: CONTRACTS.DisruptArt,
		to: address,
		addressMap: {
			NonFungibleToken: address,
		},
	})
	await deployContractByName({
		name: CONTRACTS.OneFootballCollectible,
		to: address,
		addressMap: {
			NonFungibleToken: address,
		},
	})
	await deployContractByName({
		name: CONTRACTS.MetadataViews,
		to: address,
		addressMap: {},
	})
	await deployContractByName({
		name: CONTRACTS.RaribleNFTv2,
		to: address,
		addressMap: {
			NonFungibleToken: address,
			MetadataViews: address,
			LicensedNFT: address,
		},
	})
	await deployContractByName({
		name: CONTRACTS.SoftCollection,
		to: address,
		addressMap: {
			NonFungibleToken: address,
			MetadataViews: address,
			RaribleNFTv2: address,
			LicensedNFT: address,
		},
	})
	await deployContractByName({
		name: CONTRACTS.BarterYardPackNFT,
		to: address,
		addressMap: {
			NonFungibleToken: address,
			MetadataViews: address,
		},
	})
	await deployContractByName({
		name: CONTRACTS.FanfareNFTContract,
		to: address,
		addressMap: {
			NonFungibleToken: address,
		},
	})
	await deployContractByName({
		name: CONTRACTS.NFTLX,
		to: address,
		addressMap: {
			NonFungibleToken: address,
		},
	})
	await deployContractByName({
		name: CONTRACTS.Kicks,
		to: address,
		addressMap: {
			NonFungibleToken: address,
			TopShot: address,
			NFTLX: address,
		},
	})
	await deployContractByName({
		name: CONTRACTS.Moments,
		to: address,
		addressMap: {
			NonFungibleToken: address,
		},
	})
}
