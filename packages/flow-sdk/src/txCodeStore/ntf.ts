import { CommonNft } from "@rarible/flow-sdk-scripts"
import { CollectionName } from "../types"

export const nftCode = {
	Rarible: {
		mint: CommonNft.mint,
		burn: CommonNft.burn,
		transfer: CommonNft.transfer,
	},
	CommonNFT: {
		mint: CommonNft.mint,
		burn: CommonNft.burn,
		transfer: CommonNft.transfer,
	},
}

export function getNftCode(collection: CollectionName) {
	switch (collection) {
		case "CommonNFT":
		case "Rarible": {
			return nftCode[collection]
		}
		default: {
			throw Error("SDK Error,this collection doesn't support mint/burn/transfer actions")
		}
	}
}
