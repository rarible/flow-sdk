import type { Fcl, FclArgs } from "@rarible/fcl-types"
import * as t from "@onflow/types"
import { commonNft, RaribleNFT, RaribleNFTv2, SoftCollection } from "@rarible/flow-sdk-scripts"
import type { FlowRoyalty } from "@rarible/flow-api-client"
import type { FlowAddress } from "@rarible/types"
import { getNftCodeConfig } from "../config/cadence-code-config"
import type { FlowFee, NonFungibleContract } from "../types"
import { NON_FUNGIBLE_CONTRACTS } from "../types"
import { fetchMeta } from "../interfaces/nft/common/fetch-meta"
import { getIpfsCid } from "../common/get-ipfs-cid"
import { fillCodeTemplate } from "./common/template-replacer"
import { convertRoyalties } from "./common/convert-royalties"
import { convertIpfsAttributes } from "./common/convert-ipfs-attributes"

type NftCodeReturnData = {
	cadence: string
	args?: ReturnType<FclArgs>
}

export type BlockchainApiMintRequest = {
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

type UpdateCollectionRequest = {
	fcl: Fcl,
	address: FlowAddress,
	collectionIdNumber: number
	icon?: string
	description?: string
	url?: string
	royalties?: FlowFee[]
}

interface GetNftCode {
	burn(fcl: Fcl, tokenId: number): NftCodeReturnData

	transfer(fcl: Fcl, tokenId: number, to: string): NftCodeReturnData

	mint(request: BlockchainApiMintRequest): Promise<NftCodeReturnData>

	check(fcl: Fcl, address: string): NftCodeReturnData

	setupAccount(): NftCodeReturnData

	createCollection(request: CreateCollectionRequest): NftCodeReturnData

	updateCollection(request: UpdateCollectionRequest): NftCodeReturnData
}

export function getNftCode(contractName: NonFungibleContract): GetNftCode {
	if (NON_FUNGIBLE_CONTRACTS.includes(contractName)) {
		const map = getNftCodeConfig(contractName)
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
				const contractType: NonFungibleContract = contractName === "SoftCollection" ? "RaribleNFTv2" : contractName
				const RoyaltiesType = t.Array(t.Struct(
					`A.${fcl.sansPrefix(address)}.${contractType}.Royalty`,
					[
						{ value: t.Address },
						{ value: t.UFix64 },
					],
				))
				switch (contractName) {
					case "RaribleNFT": {
						return {
							cadence: RaribleNFT.mint,
							args: fcl.args([
								fcl.arg(metadata, t.String),
								fcl.arg(convertRoyalties(royalties), RoyaltiesType),
							]),
						}
					}
					case "SoftCollection": {
						const { name: nftName, description, attributes, image } = await fetchMeta(metadata)
						const metaArg = fcl.arg(
							{
								fields: [
									{ name: "name", value: nftName || "" },
									{ name: "description", value: description || null },
									{ name: "cid", value: getIpfsCid(metadata) },
									{
										name: "attributes",
										value: attributes ? convertIpfsAttributes(attributes) : [],
									},
									{ name: "contentUrls", value: image ? [image] : [] },
								],
							},
							t.Struct(
								`A.${fcl.sansPrefix(address)}.${contractType}.Meta`,
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
				const RoyaltiesType = t.Array(t.Struct(
					`A.${fcl.sansPrefix(address)}.${contractName}.Royalty`,
					[
						{ value: t.Address },
						{ value: t.UFix64 },
					],
				))
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
						fcl.arg(convertRoyalties(royalties), RoyaltiesType),
					]),
				}
			},
			updateCollection: ({
													 fcl,
													 address,
													 collectionIdNumber,
													 icon,
													 description,
													 url,
													 royalties,
												 }) => {
				const RoyaltiesType = t.Array(t.Struct(
					`A.${fcl.sansPrefix(address)}.${contractName}.Royalty`,
					[
						{ value: t.Address },
						{ value: t.UFix64 },
					],
				))
				return {
					cadence: fillCodeTemplate(SoftCollection.update, map),
					args: fcl.args([
						fcl.arg(collectionIdNumber, t.UInt64),
						fcl.arg(icon || null, t.Optional(t.String)),
						fcl.arg(description || null, t.Optional(t.String)),
						fcl.arg(url || null, t.Optional(t.String)),
						fcl.arg(royalties ? convertRoyalties(royalties) : null, t.Optional(RoyaltiesType)),
					]),
				}
			},
		}
	}
	throw new Error(`Flow-sdk: Unsupported collection: ${contractName}`)
}