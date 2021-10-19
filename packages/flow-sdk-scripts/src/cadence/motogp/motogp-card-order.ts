import * as t from "@onflow/types"
import { Fcl } from "@rarible/fcl-types"
import { Currency } from "../../index"
import { orderCode } from "../../order"
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

	sell: (fcl: Fcl, currency: Currency, tokenId: number, price: string) => {
		return {
			cadence: fcl.transaction(orderCode.motoGp[currency]),
			args: fcl.args([fcl.arg(tokenId, t.UInt64), fcl.arg(price, t.UFix64)]),
		}
	},

	buy: (fcl: Fcl, currency: Currency, orderId: number, address: string) => {
		return {
			cadence: fcl.transaction(orderCode.motoGp[currency]),
			args: fcl.args([fcl.arg(orderId, t.UInt64), fcl.arg(address, t.Address)]),
		}
	},
}
