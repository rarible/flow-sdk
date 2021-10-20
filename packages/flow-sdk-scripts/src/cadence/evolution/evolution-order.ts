import * as t from "@onflow/types"
import { Fcl } from "@rarible/fcl-types"
import { evolutionScripts } from "./evolution-scripts"
import { evolutionTransactions } from "./evolution-transactions"

export const EvolutionOrder = {
	getIds: (fcl: Fcl, address: string) => [
		fcl.script(evolutionScripts.get_ids),
		fcl.args([fcl.arg(address, t.Address)]),
	],

	borrow: (fcl: Fcl, address: string, tokenId: number) => [
		fcl.script(evolutionScripts.borrow),
		fcl.args([fcl.arg(address, t.Address), fcl.arg(tokenId, t.UInt64)]),
	],

	sell: (fcl: Fcl, tokenId: number, price: string) => [
		fcl.transaction(evolutionTransactions.sell_item),
		fcl.args([fcl.arg(tokenId, t.UInt64), fcl.arg(price, t.UFix64)]),
	],

	buy: (fcl: Fcl, orderId: number, address: string) => [
		fcl.transaction(evolutionTransactions.buy_item),
		fcl.args([fcl.arg(orderId, t.UInt64), fcl.arg(address, t.Address)]),
	],
}
