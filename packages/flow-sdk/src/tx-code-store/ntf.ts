import type { Fcl } from "@rarible/fcl-types"
import * as t from "@onflow/types"
import { Evolution, MotoGPCard, RaribleNFT, TopShot } from "@rarible/flow-sdk-scripts"
import type { FlowRoyalty } from "../types"
import { convertRoyalties } from "../common/convert-royalties"
import type { FlowCollectionName } from "../common/collection"

type NftMethods = {
	burn: string
	transfer: string
}

export const nftCode: Record<string, NftMethods> = {
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

export function getNftCode(name: FlowCollectionName) {
	if (name in nftCode) {
		return {
			burn: (fcl: Fcl, tokenId: number) => {
				return {
					cadence: nftCode[name].burn,
					args: fcl.args([fcl.arg(tokenId, t.UInt64)]),
				}
			},

			transfer: (fcl: Fcl, tokenId: number, to: string) => {
				return {
					cadence: nftCode[name].transfer,
					args: fcl.args([fcl.arg(tokenId, t.UInt64), fcl.arg(to, t.Address)]),
				}
			},
			mint: (fcl: Fcl, address: string, metadata: string, royalties: FlowRoyalty[]) => {
				if (name === "RaribleNFT") {
					const RoyaltiesType = t.Array(t.Struct(
						`A.${fcl.sansPrefix(address)}.RaribleNFT.Royalty`,
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
	}
	throw new Error(`Flow-sdk: Unsupported collection: ${name}`)
}
