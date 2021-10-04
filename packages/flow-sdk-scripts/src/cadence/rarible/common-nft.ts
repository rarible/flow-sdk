import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"
import { commonNftScripts, commonNftTransactions } from "./scripts"

export interface Royalty {
	account: string
	value: string
}

export const convertRoyalties = (royalties: Royalty[]) =>
	royalties.map(royalty => ({
		fields: [
			{ name: "address", value: royalty.account },
			{ name: "fee", value: royalty.value },
		],
	}))

export const CommonNft = {
	borrowNft: (address: string, tokenId: number) => ({
		cadence: commonNftScripts.borrow_nft,
		args: fcl.args([fcl.arg(address, t.Address), fcl.arg(tokenId, t.UInt64)]),
	}),

	check: (address: string) => ({
		cadence: commonNftScripts.check,
		args: fcl.args([fcl.arg(address, t.Address)]),
	}),

	getIds: (address: string) => ({
		cadence: commonNftScripts.get_ids,
		args: fcl.args([fcl.arg(address, t.Address)]),
	}),

	burn: (tokenId: number) => ({
		cadence: commonNftTransactions.burn,
		args: fcl.args([fcl.arg(tokenId, t.UInt64)]),
	}),

	init: () => ({
		cadence: commonNftTransactions.init,
	}),

	clean: () => ({
		cadence: commonNftTransactions.clean,
	}),

	mint: (collectionAddress: string, metadata: string, royalties: Royalty[]) => {
		const RoyaltiesType = t.Array(t.Struct(
			`A.${fcl.sansPrefix(collectionAddress)}.CommonNFT.Royalties`,
			[
				{ value: t.Address },
				{ value: t.UFix64 },
			],
		))

		return ({
			cadence: commonNftTransactions.mint,
			args: fcl.args([fcl.arg(metadata, t.String), fcl.arg(convertRoyalties(royalties), RoyaltiesType)]),
		})
	},

	transfer: (tokenId: number, to: string) => ({
		cadence: commonNftTransactions.transfer,
		args: fcl.args([fcl.arg(tokenId, t.UInt64), fcl.arg(to, t.Address)]),
	}),
}
