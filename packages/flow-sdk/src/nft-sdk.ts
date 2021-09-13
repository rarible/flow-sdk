import { CommonNft, runTransaction, waitForSeal } from "@rarible/flow-sdk-scripts"
import { Part, RaribleNftSdk, TokenId, TransferRequest } from "./temp"
import { contractAddressHex } from "@rarible/flow-sdk-scripts/build/common"

const mint = async (metadata: string, royalties: Part[]) => {
	const txId = await runTransaction(await CommonNft.mint(metadata, royalties))
	const result = await waitForSeal(txId)
	console.log(result.events)
	return txId
}

export const NftSdk: RaribleNftSdk = {
	mint: async data => {
		const commonNftAddress = await contractAddressHex("0xCOMMONNFT")
		switch (data.collection) {
			case `A.${commonNftAddress}.CommonNFT.NFT`:
				return mint(data.url, data.royalties)
		}
	},

	transfer: async (data: TransferRequest) => {
		return "todo"
	},

	burn: async (tokenId: TokenId) => {
		return "todo"
	},
}

