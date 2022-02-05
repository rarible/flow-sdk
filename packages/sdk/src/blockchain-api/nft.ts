import type { Fcl, FclArgs } from "@rarible/fcl-types"
import * as t from "@onflow/types"
import { commonNft, RaribleNFT, RaribleNFTv2, SoftCollection } from "@rarible/flow-sdk-scripts"
import type { FlowRoyalty } from "@rarible/flow-api-client"
import type { FlowAddress } from "@rarible/types"
import { getNftCodeConfig } from "../config/cadence-code-config"
import type { FlowContractName, FlowFee, NonFungibleContract } from "../types/types"
import { NON_FUNGIBLE_CONTRACTS } from "../types/types"
import { fetchMeta } from "../interfaces/nft/common/fetch-meta"
import { fillCodeTemplate } from "./common/template-replacer"
import { convertRoyalties } from "./common/convert-royalties"
import { prepareFees } from "./common/convert-fee-to-cadence"

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
	receiver: FlowAddress
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

	mint(request: MintRequest): Promise<NftCodeReturnData>

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
			mint: async ({ fcl, address, metadata, royalties, minterId, receiver }) => {
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
						const { name: nftName, description, attributes } = await fetchMeta(metadata)
						const metaArg = fcl.arg(
							{
								fields: [
									{ name: "name", value: nftName || "" },
									{ name: "description", value: description || null },
									{ name: "cid", value: "" },
									{
										name: "attributes",
										value: attributes?.map(a => {
											const attribute = Object.entries(a)[0]
											return { key: attribute[0], value: attribute[1] }
										}),
									},
									{ name: "contentUrls", value: [] },
								],
							},
							t.Struct(
								`A.${fcl.sansPrefix(address)}.${name}.Meta`,
								[
									{ value: t.String },
									{ value: t.Optional(t.String) },
									{ value: t.String },
									{ value: t.Dictionary({ key: t.String, value: t.String }) },
									{ value: t.Array(t.String) },
								]),
						)
						if (minterId && receiver) {
							return {
								cadence: RaribleNFTv2.mint,
								args: fcl.args([
									fcl.arg(parseInt(minterId), t.UInt64),
									fcl.arg(receiver, t.Address),
									metaArg,
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
													 receiver,
													 name,
													 symbol,
													 royalties,
													 parentId,
													 icon,
													 description,
													 url,
													 supply,
												 }) => {
				const preparedMap = { ...map, "0xSOFTCOLLECTION": address }
				return {
					cadence: fillCodeTemplate(SoftCollection.create, preparedMap),
					args: fcl.args([
						fcl.arg(receiver, t.Address),
						fcl.arg(parentId === undefined ? null : parentId, t.Optional(t.UInt64)),
						fcl.arg(name, t.String),
						fcl.arg(symbol, t.String),
						fcl.arg(icon || null, t.Optional(t.String)),
						fcl.arg(description || null, t.Optional(t.String)),
						fcl.arg(url || null, t.Optional(t.String)),
						fcl.arg(supply === undefined ? null : supply, t.Optional(t.UInt64)),
						fcl.arg(prepareFees(royalties), t.Dictionary({
							key: t.Address,
							value: t.UFix64,
						})),
					]),
				}
			},
		}
	}
	throw new Error(`Flow-sdk: Unsupported collection: ${name}`)
}
