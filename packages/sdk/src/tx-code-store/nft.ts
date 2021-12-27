import type { Fcl } from "@rarible/fcl-types"
import * as t from "@onflow/types"
import { commonNft, RaribleNFT } from "@rarible/flow-sdk-scripts"
import type { FlowRoyalty } from "@rarible/flow-api-client"
import { convertRoyalties } from "../common/convert-royalties"
import type { FlowCollectionName } from "../common/collection"
import { flowCollections } from "../common/collection"
import { getNftCodeConfig } from "../config/cadence-code-config"
import type { FlowContractName } from "../types"
import { fillCodeTemplate } from "../common/template-replacer"
import type { PreparedTransactionParamsResponse } from "./domain"

interface GetNftCode {
	burn(fcl: Fcl, tokenId: number): PreparedTransactionParamsResponse

	transfer(fcl: Fcl, tokenId: number, to: string): PreparedTransactionParamsResponse

	mint(fcl: Fcl, address: string, metadata: string, royalties: FlowRoyalty[]): PreparedTransactionParamsResponse

	check(fcl: Fcl, address: string): PreparedTransactionParamsResponse

	setupAccount(): PreparedTransactionParamsResponse
}

export function getNftCode(name: FlowCollectionName): GetNftCode {
	if (flowCollections.includes(name)) {
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
