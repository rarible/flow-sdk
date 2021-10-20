import * as t from "@onflow/types"
import { Fcl } from "@rarible/fcl-types"
import { motogpCardTransactions } from "../../index"
import { motogpCardScripts } from "./motogp-card-scripts"

export const MotogpCardOrder = {
	getIds: (fcl: Fcl, address: string) => ({
		cadence: fcl.script(motogpCardScripts.get_card_ids),
		args: fcl.args([fcl.arg(address, t.Address)]),
	}),

	borrow: (fcl: Fcl, address: string, tokenId: number) => ({
		cadence: fcl.script(motogpCardScripts.borrow_card),
		args: fcl.args([fcl.arg(address, t.Address), fcl.arg(tokenId, t.UInt64)]),
	}),

	sell: (fcl: Fcl, tokenId: number, price: string) => {
		return {
			cadence: fcl.transaction(motogpCardTransactions.sell_card),
			args: fcl.args([fcl.arg(tokenId, t.UInt64), fcl.arg(price, t.UFix64)]),
		}
	},

	buy: (fcl: Fcl, orderId: number, address: string) => {
		return {
			cadence: fcl.transaction(motogpCardTransactions.buy_card),
			args: fcl.args([fcl.arg(orderId, t.UInt64), fcl.arg(address, t.Address)]),
		}
	},
}
