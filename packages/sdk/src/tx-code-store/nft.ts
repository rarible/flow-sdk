import type { Fcl, FclArgs } from "@rarible/fcl-types"
import * as t from "@onflow/types"
import type { FlowRoyalty } from "@rarible/flow-api-client"
import { convertRoyalties } from "../common/convert-royalties"
import { getNftCodeConfig } from "../config/cadence-code-config"
import type { FlowContractName, NonFungibleContract } from "../types"
import { NON_FUNGIBLE_CONTRACTS } from "../types"
import { fillCodeTemplate } from "../common/template-replacer"
import {commonNft, RaribleNFT} from "../scripts/nft"
import {getTransferCode} from "../scripts/nft/mattel/transfer"

type NftCodeReturnData = {
	cadence: string
	args?: ReturnType<FclArgs>
}

interface GetNftCode {
	burn(fcl: Fcl, tokenId: number): NftCodeReturnData

	transfer(fcl: Fcl, tokenId: number, to: string): NftCodeReturnData

	mint(fcl: Fcl, address: string, metadata: string, royalties: FlowRoyalty[]): NftCodeReturnData

	check(fcl: Fcl, address: string): NftCodeReturnData

	setupAccount(): NftCodeReturnData
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
				let transferCdc
				switch (name) {
					case "HWGaragePack":
					case "HWGarageCard":
					case "HWGarageCardV2":
					case "HWGaragePackV2":
					case "HWGarageTokenV2":
					case "BBxBarbieCard":
					case "BBxBarbiePack":
					case "BBxBarbieToken":
						transferCdc = getTransferCode(name)
						break
					default: transferCdc = commonNft.transfer
				}
				return {
					cadence: fillCodeTemplate(transferCdc, map),
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
						args: fcl.args([
							fcl.arg(metadata, t.String),
							fcl.arg(convertRoyalties(royalties), RoyaltiesType),
						]),
					}
				}
				throw new Error("This collection doesn't support minting")
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
		}
	}
	throw new Error(`Flow-sdk: Unsupported collection: ${name}`)
}
