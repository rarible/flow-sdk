import * as t from "@onflow/types"
import { Fcl } from "@rarible/fcl-types"
import { motogpPackTransactions } from "./motogp-pack-transactions"
import { motogpPackScripts } from "./motogp-pack-scripts"

export const MotogpPackOrder = {
	getIds: (fcl: Fcl, address: string) => [
		fcl.script(motogpPackScripts.get_pack_ids),
		fcl.args([fcl.arg(address, t.Address)]),
	],

	borrow: (fcl: Fcl, address: string, tokenId: number) => [
		fcl.script(motogpPackScripts.borrow_pack),
		fcl.args([fcl.arg(address, t.Address), fcl.arg(tokenId, t.UInt64)]),
	],

	sell: (fcl: Fcl, tokenId: number, price: string) => [
		fcl.transaction(motogpPackTransactions.sell_pack),
		fcl.args([fcl.arg(tokenId, t.UInt64), fcl.arg(price, t.UFix64)]),
	],

	buy: (fcl: Fcl, orderId: number, address: string) => [
		fcl.transaction(motogpPackTransactions.buy_pack),
		fcl.args([fcl.arg(orderId, t.UInt64), fcl.arg(address, t.Address)]),
	],
}
