import { deployContractByName } from "flow-js-testing"

export async function deployAll(address: string) {
	await deployContractByName({
		name: "NonFungibleToken",
		to: address,
	})

	await deployContractByName({
		name: "NFTPlus",
		to: address,
		addressMap: {
			NonFungibleToken: address,
			// FungibleToken: address,
		},
	})
	await deployContractByName({
		name: "CommonFee",
		to: address,
	})
	await deployContractByName({
		name: "CommonNFT",
		to: address,
		addressMap: {
			NonFungibleToken: address,
			NFTPlus: address,
		},
	})
	await deployContractByName({
		name: "NFTStorefront",
		to: address,
		addressMap: {
			NonFungibleToken: address,
			// FungibleToken: address,
		},
	})
}
