import * as t from "@onflow/types"
import { Fcl } from "@rarible/fcl-types"
import { Royalty } from "../../index"
import { commonNftScripts, commonNftTransactions } from "./scripts"
import { CommonNftSources } from "./common-nft-sources"

export const convertRoyalties = (royalties: Royalty[]) =>
	royalties.map(royalty => ({
		fields: [
			{ name: "address", value: royalty.account },
			{ name: "fee", value: royalty.value },
		],
	}))

export const CommonNft = {
	borrowNft: (fcl: Fcl, address: string, tokenId: number) => ({
		cadence: commonNftScripts.borrow_nft,
		args: fcl.args([fcl.arg(address, t.Address), fcl.arg(tokenId, t.UInt64)]),
	}),

	check: (fcl: Fcl, address: string) => ({
		cadence: commonNftScripts.check,
		args: fcl.args([fcl.arg(address, t.Address)]),
	}),

	getIds: (fcl: Fcl, address: string) => ({
		cadence: commonNftScripts.get_ids,
		args: fcl.args([fcl.arg(address, t.Address)]),
	}),

	burn: (fcl: Fcl, tokenId: number) => ({
		cadence: CommonNftSources.burn,
		args: fcl.args([fcl.arg(tokenId, t.UInt64)]),
	}),

	init: () => ({
		cadence: commonNftTransactions.init,
	}),

	clean: () => ({
		cadence: commonNftTransactions.clean,
	}),

	mint: (fcl: Fcl, collectionAddress: string, metadata: string, royalties: Royalty[]) => {
		const RoyaltiesType = t.Array(t.Struct(
			`A.${fcl.sansPrefix(collectionAddress)}.CommonNFT.Royalty`,
			[
				{ value: t.Address },
				{ value: t.UFix64 },
			],
		))

		return ({
			cadence: CommonNftSources.mint,
			args: fcl.args([fcl.arg(metadata, t.String), fcl.arg(convertRoyalties(royalties), RoyaltiesType)]),
		})
	},

	transfer: (fcl: Fcl, tokenId: number, to: string) => ({
		cadence: CommonNftSources.transfer,
		args: fcl.args([fcl.arg(tokenId, t.UInt64), fcl.arg(to, t.Address)]),
	}),
}
