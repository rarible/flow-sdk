import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"
import { motogpCardTransactions } from "./motogp-card-transactions"
import { motogpCardScripts } from "./motogp-card-scripts"

export const MotogpCardOrder = {
	getIds: (address: string) => ({
		cadence: fcl.script(motogpCardScripts.get_card_ids),
		args: fcl.args([fcl.arg(address, t.Address)]),
	}),

	borrow: (address: string, tokenId: number) => ({
		cadence: fcl.script(motogpCardScripts.borrow_card),
		args: fcl.args([fcl.arg(address, t.Address), fcl.arg(tokenId, t.UInt64)]),
	}),

	sell: (tokenId: number, price: string) => ({
		cadence: fcl.transaction(motogpCardTransactions.sell_card),
		args: fcl.args([fcl.arg(tokenId, t.UInt64), fcl.arg(price, t.UFix64)]),
	}),

	buy: (orderId: number, address: string) => ({
		cadence: fcl.transaction(motogpCardTransactions.buy_card),
		args: fcl.args([fcl.arg(orderId, t.UInt64), fcl.arg(address, t.Address)]),
	}),
}
