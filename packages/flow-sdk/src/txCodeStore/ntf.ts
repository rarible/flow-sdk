import { Fcl } from "@rarible/fcl-types"
import t from "@onflow/types"
import { Royalty } from "@rarible/flow-sdk-scripts/src"
import { CommonNFT, CommonNftSources, Evolution, MotoGPCard, TopShot } from "@rarible/flow-sdk-scripts"
import { CollectionName } from "../types"
import { convertRoyalties } from "../common/convert-royalties"

type NftMethods = {
	burn: string
	transfer: string
}

type NftCodeType = Record<CollectionName, NftMethods>

export const nftCode: NftCodeType = {
	Rarible: {
		burn: CommonNFT.burn,
		transfer: CommonNFT.transfer,
	},
	CommonNFT: {
		burn: CommonNFT.burn,
		transfer: CommonNFT.transfer,
	},
	TopShot: {
		burn: TopShot.burn,
		transfer: TopShot.transfer,
	},
	Evolution: {
		burn: Evolution.burn,
		transfer: Evolution.transfer,
	},
	MotoGPCard: {
		burn: MotoGPCard.burn,
		transfer: MotoGPCard.transfer,
	},
}

export function getNftCode(collection: CollectionName) {
	if (collection in nftCode) {
		return {
			burn: (fcl: Fcl, tokenId: number) => {
				return {
					cadence: nftCode[collection].burn,
					args: fcl.args([fcl.arg(tokenId, t.UInt64)]),
				}
			},

			transfer: (fcl: Fcl, tokenId: number, to: string) => {
				return {
					cadence: nftCode[collection].transfer,
					args: fcl.args([fcl.arg(tokenId, t.UInt64), fcl.arg(to, t.Address)]),
				}
			},
			mint: (fcl: Fcl, collectionAddress: string, metadata: string, royalties: Royalty[]) => {
				if (collection === "Rarible" || collection === "CommonNFT") {
					const RoyaltiesType = t.Array(t.Struct(
						`A.${fcl.sansPrefix(collectionAddress)}.CommonNFT.Royalty`,
						[
							{ value: t.Address },
							{ value: t.UFix64 },
						],
					))
					return {
						cadence: CommonNftSources.mint,
						args: fcl.args([fcl.arg(metadata, t.String), fcl.arg(convertRoyalties(royalties), RoyaltiesType)]),
					}
				}
				throw Error("This collection doesn't support minting")
			},
		}
	} else {
		throw Error(`Flow-sdk: Unsupported collection: ${collection}`)
	}
}
