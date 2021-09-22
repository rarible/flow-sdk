import * as t from "@onflow/types"
import { commonNftScripts, commonNftTransactions } from "./scripts"
import { MethodArgs } from "./common"
import { sansPrefix } from "./crypto"

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
	borrowNft: (address: string, tokenId: number): MethodArgs => ({
		type: "script",
		cadence: commonNftScripts.borrow_nft,
		args: [[address, t.Address], [tokenId, t.UInt64]],
	}),

	check: (address: string): MethodArgs => ({
		type: "script",
		cadence: commonNftScripts.check,
		args: [[address, t.Address]],
	}),

	getIds: (address: string): MethodArgs => ({
		type: "script",
		cadence: commonNftScripts.get_ids,
		args: [[address, t.Address]],
	}),

	burn: (tokenId: number): MethodArgs => ({
		type: "tx",
		cadence: commonNftTransactions.burn,
		args: [[tokenId, t.UInt64]],
	}),

	init: (): MethodArgs => ({
		type: "tx",
		cadence: commonNftTransactions.init,
	}),

	clean: (): MethodArgs => ({
		type: "tx",
		cadence: commonNftTransactions.clean,
	}),

	mint: (collectionAddress: string, metadata: string, royalties: Royalty[]): MethodArgs => {
		const RoyaltiesType = t.Array(t.Struct(
			`A.${sansPrefix(collectionAddress)}.CommonNFT.Royalties`,
			[
				{ value: t.Address },
				{ value: t.UFix64 },
			],
		))

		return {
			type: "tx",
			cadence: commonNftTransactions.mint,
			args: [[metadata, t.String], [convertRoyalties(royalties), RoyaltiesType]],
		}
	},

	transfer: (tokenId: number, to: string): MethodArgs => ({
		type: "tx",
		cadence: commonNftTransactions.transfer,
		args: [[tokenId, t.UInt64], [to, t.Address]],
	}),
}
