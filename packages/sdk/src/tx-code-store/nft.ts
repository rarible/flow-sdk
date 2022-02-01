import type { Fcl, FclArgs } from "@rarible/fcl-types"
import * as t from "@onflow/types"
import { commonNft, RaribleNFT } from "@rarible/flow-sdk-scripts"
import type { FlowRoyalty } from "@rarible/flow-api-client"
import { RaribleNFTv2, SoftCollection } from "@rarible/flow-sdk-scripts/src"
import type { FlowAddress } from "@rarible/types"
import { convertRoyalties } from "../common/convert-royalties"
import { getNftCodeConfig } from "../config/cadence-code-config"
import type { FlowContractName, FlowFee, NonFungibleContract } from "../types"
import { NON_FUNGIBLE_CONTRACTS } from "../types"
import { fillCodeTemplate } from "../common/template-replacer"

type NftCodeReturnData = {
	cadence: string
	args?: ReturnType<FclArgs>
}

type MintRequest = {
	fcl: Fcl, address: string, minterId?: string, receiver?: string, metadata: string, royalties: FlowRoyalty[]
}

type CreateCollectionRequest = {
	fcl: Fcl
	address: string
	from: FlowAddress
	name: string,
	symbol: string,
	royalties: FlowFee[]
	icon?: string
	parentId?: number,
	description?: string
	url?: string
	supply?: number
}

interface GetNftCode {
	burn(fcl: Fcl, tokenId: number): NftCodeReturnData

	transfer(fcl: Fcl, tokenId: number, to: string): NftCodeReturnData

	mint(request: MintRequest): NftCodeReturnData

	check(fcl: Fcl, address: string): NftCodeReturnData

	setupAccount(): NftCodeReturnData

	createCollection(request: CreateCollectionRequest): NftCodeReturnData
}

export function getNftCode(name: NonFungibleContract): GetNftCode {
	if (NON_FUNGIBLE_CONTRACTS.includes(name)) {
		const map = getNftCodeConfig(name as FlowContractName)
		return {
			burn: (fcl: Fcl, tokenId: number) => {
				return {
					cadence: fillCodeTemplate(commonNft.burn, map),
					args: fcl.args([fcl.arg(tokenId, t.UInt64)]),
				}
			},

			transfer: (fcl: Fcl, tokenId: number, to: string) => {
				return {
					cadence: fillCodeTemplate(commonNft.transfer, map),
					args: fcl.args([fcl.arg(tokenId, t.UInt64), fcl.arg(to, t.Address)]),
				}
			},
			mint: ({ fcl, address, metadata, royalties, minterId, receiver }) => {
				const RoyaltiesType = t.Array(t.Struct(
					`A.${fcl.sansPrefix(address)}.${name}.Royalty`,
					[
						{ value: t.Address },
						{ value: t.UFix64 },
					],
				))
				switch (name) {
					case "RaribleNFT": {
						return {
							cadence: RaribleNFT.mint,
							args: fcl.args([
								fcl.arg(metadata, t.String),
								fcl.arg(convertRoyalties(royalties), RoyaltiesType),
							]),
						}
					}
					case "RaribleNFTv2": {
						if (minterId && receiver) {
							return {
								cadence: RaribleNFTv2.mint,
								args: fcl.args([
									fcl.arg(minterId, t.UInt64),
									fcl.arg(receiver, t.Address),
									fcl.arg(metadata, t.String),
									fcl.arg(convertRoyalties(royalties), RoyaltiesType),
								]),
							}
						}
						throw new Error("Minter ID or receiver address is undefined")
					}
					default:
						throw new Error("This collection doesn't support minting")
				}
			},
			check: (fcl: Fcl, address: string) => {
				return {
					cadence: fillCodeTemplate(commonNft.check, map),
					args: fcl.args([fcl.arg(address, t.Address)]),
				}
			},
			setupAccount: () => {
				return {
					cadence: fillCodeTemplate(commonNft.setupAccount, map),
				}
			},
			createCollection: ({
													 fcl,
													 address,
													 from,
													 name,
													 symbol,
													 royalties,
													 parentId,
													 icon,
													 description,
													 url,
													 supply,
												 }) => {
				const RoyaltiesType = t.Array(t.Struct(
					`A.${fcl.sansPrefix(address)}.SoftCollection.Royalty`,
					[
						{ value: t.Address },
						{ value: t.UFix64 },
					],
				))
				return {
					cadence: fillCodeTemplate(SoftCollection.create, map),
					args: fcl.args([
						fcl.arg(from, t.Address),
						fcl.arg(parentId || null, t.Optional(t.UInt64)),
						fcl.arg(name, t.String),
						fcl.arg(symbol, t.String),
						fcl.arg(icon || null, t.Optional(t.String)),
						fcl.arg(description || null, t.Optional(t.String)),
						fcl.arg(url || null, t.Optional(t.String)),
						fcl.arg(supply || null, t.Optional(t.UInt64)),
						fcl.arg(convertRoyalties(royalties), RoyaltiesType),
					]),
				}
			},
		}
	}
	throw new Error(`Flow-sdk: Unsupported collection: ${name}`)
}
