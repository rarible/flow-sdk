import type { Fcl } from "@rarible/fcl-types"
import * as t from "@onflow/types"
import { Evolution, MotoGPCard, RaribleNFT, TopShot } from "@rarible/flow-sdk-scripts"
import type { CollectionName, Royalty } from "../types"
import { convertRoyalties } from "../common/convert-royalties"

type NftMethods = {
	burn: string
	transfer: string
}

type NftCodeType = Record<CollectionName, NftMethods>

export const nftCode: NftCodeType = {
	RaribleNFT: {
		burn: RaribleNFT.burn,
		transfer: RaribleNFT.transfer,
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
				if (collection === "RaribleNFT") {
					const RoyaltiesType = t.Array(t.Struct(
						`A.${fcl.sansPrefix(collectionAddress)}.RaribleNFT.Royalty`,
						[
							{ value: t.Address },
							{ value: t.UFix64 },
						],
					))
					return {
						cadence: RaribleNFT.mint,
						args: fcl.args([fcl.arg(metadata, t.String), fcl.arg(convertRoyalties(royalties), RoyaltiesType)]),
					}
				}
				throw new Error("This collection doesn't support minting")
			},
		}
	} else {
		throw new Error(`Flow-sdk: Unsupported collection: ${collection}`)
	}
}
