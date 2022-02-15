import type { Fcl } from "@rarible/fcl-types"
import { englishAuctionScriptsCode } from "@rarible/flow-sdk-scripts"
import * as t from "@onflow/types"
import type { PreparedTransactionParamsResponse } from "../domain"

export const getEnglishAuctionScript = {
	getLot(fcl: Fcl, lotId: number): PreparedTransactionParamsResponse {
		return {
			cadence: englishAuctionScriptsCode.borrowLot,
			args: fcl.args([fcl.arg(lotId, t.UInt64)]),
		}
	},
	getIds(fcl: Fcl, lotId: number): PreparedTransactionParamsResponse {
		return {
			cadence: englishAuctionScriptsCode.lotIds,
			args: fcl.args([fcl.arg(lotId, t.UInt64)]),
		}
	},
}
