import { toBigNumberLike } from "@rarible/types"
import { toBn } from "@rarible/utils"
import type { FlowFee, FlowNetwork } from "../types"
import { CONFIGS } from "../config/config"

export type ProtocolFees = {
	buyerFee: FlowFee
	sellerFee: FlowFee
}

/**
 * returns fees object with value format in basis points 10000
 * @param network
 */
export function getProtocolFee(network: FlowNetwork): ProtocolFees {
	return {
		buyerFee: CONFIGS[network].protocolFee,
		sellerFee: CONFIGS[network].protocolFee,
	}
}

/**
 * returns fees object with value in format floating points
 * @param network
 */
getProtocolFee.percents = (network: FlowNetwork): ProtocolFees => {
	const { account, value } = CONFIGS[network].protocolFee
	const percentsValue = toBigNumberLike(toBn(value).div(10000).toString())
	return {
		buyerFee: { account, value: percentsValue },
		sellerFee: { account, value: percentsValue },
	}
}
