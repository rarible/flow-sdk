import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"
import { commonNftScripts, commonNftTransactions } from "./scripts"
import { contractAddressHex } from "./common"

export interface Royalty {
	account: string
	value: string
}

const convertRoyalties = (royalties: Royalty[]) =>
	royalties.map(royalty => ({
		fields: [
			{ name: "address", value: royalty.account },
			{ name: "fee", value: royalty.value },
		],
	}))

export const CommonNft = {
	borrowNft: (address: string, tokenId: number) => [
		fcl.script(commonNftScripts.borrow_nft),
		fcl.args([fcl.arg(address, t.Address), fcl.arg(tokenId, t.UInt64)]),
	],

	check: (address: string) => [
		fcl.script(commonNftScripts.check),
		fcl.args([fcl.arg(address, t.Address)]),
	],

	getIds: (address: string) => [
		fcl.script(commonNftScripts.get_ids),
		fcl.args([fcl.arg(address, t.Address)]),
	],

	burn: (tokenId: number) => [
		fcl.transaction(commonNftTransactions.burn),
		fcl.args([fcl.arg(tokenId, t.UInt64)]),
	],

	init: () => [
		fcl.transaction(commonNftTransactions.init),
	],

	clean: () => [
		fcl.transaction(commonNftTransactions.clean),
	],

	mint: async (metadata: string, royalties: Royalty[]) => {
		const commonNftAddress = await contractAddressHex("0xCOMMONNFT")
		const RoyaltiesType = t.Array(t.Struct(
			`A.${commonNftAddress}.CommonNFT.Royalties`,
			[
				{ value: t.Address },
				{ value: t.UFix64 },
			],
		))

		return [
			fcl.transaction(commonNftTransactions.mint),
			fcl.args([fcl.arg(metadata, t.String), fcl.arg(convertRoyalties(royalties), RoyaltiesType)]),
		]
	},

	transfer: (tokenId: number, to: string) => [
		fcl.transaction(commonNftTransactions.transfer),
		fcl.args([fcl.arg(tokenId, t.UInt64), fcl.arg(to, t.Address)]),
	],
}
