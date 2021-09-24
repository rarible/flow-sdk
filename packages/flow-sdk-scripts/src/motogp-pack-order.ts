import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"
import { motogpPackTransactions } from "./motogp-pack-transactions"
import { motogpPackScripts } from "./motogp-pack-scripts"

export const MotogpPackOrder = {
	getIds: (address: string) => [
		fcl.script(motogpPackScripts.get_pack_ids),
		fcl.args([fcl.arg(address, t.Address)]),
	],

	borrow: (address: string, tokenId: number) => [
		fcl.script(motogpPackScripts.borrow_pack),
		fcl.args([fcl.arg(address, t.Address), fcl.arg(tokenId, t.UInt64)]),
	],

	sell: (tokenId: number, price: string) => [
		fcl.transaction(motogpPackTransactions.sell_pack),
		fcl.args([fcl.arg(tokenId, t.UInt64), fcl.arg(price, t.UFix64)]),
	],

	buy: (orderId: number, address: string) => [
		fcl.transaction(motogpPackTransactions.buy_pack),
		fcl.args([fcl.arg(orderId, t.UInt64), fcl.arg(address, t.Address)]),
	],
}
