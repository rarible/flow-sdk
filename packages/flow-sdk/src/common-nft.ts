import { executeScript, getContractAddress, sendTransaction } from "flow-js-testing"
import * as t from "@onflow/types"
import * as fcl from "@onflow/fcl"


export type Royalty = {
	address: string,
	fee: string,
}

export const setupCommonNFTOnAccount = async (account: string) => sendTransaction({
	name: "commonNft/init",
	signers: [account],
})

export const cleanCommonNFTOnAccount = async (account: string) => sendTransaction({
	name: "commonNft/clean",
	signers: [account],
})

export const commonNFTMint = async (account: string, metadata: string, royalties: [Royalty]) => sendTransaction({
	name: "commonNft/mint",
	signers: [account],
	args: [
		[metadata, t.String],
		[royalties.map(value => ({
			fields: [
				{ name: "address", value: value.address },
				{ name: "fee", value: value.fee },
			],
		})),
			t.Array(
				t.Struct(
					`A.${fcl.sansPrefix(await getContractAddress("CommonNFT"))}.CommonNFT.Royalties`,
					[
						{ value: t.Address },
						{ value: t.UFix64 },
					],
				),
			),
		],
	],
})

export const commonNFTBurn = async (account: string, tokenId: number) => sendTransaction({
	name: "commonNft/burn",
	signers: [account],
	args: [tokenId],
})

export const commonNFTTransfer = async (account: string, tokenId: number, to: string) => sendTransaction({
	name: "commonNft/transfer",
	signers: [account],
	args: [tokenId, to],
})

export const checkCommonNFT = async (account: string) => executeScript({
	name: "commonNft/check",
	args: [account],
})

export const getCommonNFTIds = async (account: string) => executeScript({
	name: "commonNft/get_ids",
	args: [account],
})

export const getCommonNFTDetails = async (address: string, tokenId: number) => executeScript({
	name: "commonNft/borrow_nft",
	args: [address, tokenId],
})
