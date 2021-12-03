import type { Fcl } from "@rarible/fcl-types"
import type { Maybe } from "@rarible/types/build/maybe"
import type { BigNumber, FlowContractAddress } from "@rarible/types"
import { toBigNumber } from "@rarible/types"
import { toBn } from "@rarible/utils"
import type { AuthWithPrivateKey, FlowCurrency, FlowFee, FlowNetwork, FlowOriginFees } from "../types"
import { runTransaction, waitForSeal } from "../common/transaction"
import { getCollectionConfig } from "../common/collection/get-config"
import { getBidCode } from "../tx-code-store/order/bid"
import { parseEvents } from "../common/parse-tx-events"
import { getProtocolFee } from "../tx-code-store/get-protocol-fee"
import type { FlowItemId } from "../common/item"
import { extractTokenId } from "../common/item"
import type { FlowSellResponse } from "./sell"

export async function bid(
	fcl: Maybe<Fcl>,
	auth: AuthWithPrivateKey,
	network: FlowNetwork,
	collection: FlowContractAddress,
	currency: FlowCurrency,
	itemId: FlowItemId,
	price: BigNumber,
	originFee?: FlowOriginFees,
): Promise<FlowSellResponse> {
	if (fcl) {
		const { name, map } = getCollectionConfig(network, collection)
		const protocolFees = await getProtocolFee(fcl, network)
		const requestFees = originFee || []
		const txId = await runTransaction(
			fcl,
			map,
			getBidCode(fcl, name).create(
				currency,
				extractTokenId(itemId),
				price,
				[...calculateFees(price, [protocolFees.buyerFee]), ...calculateFees(price, requestFees)],
			),
			auth,
		)
		const txResponse = await waitForSeal(fcl, txId)
		const simpleOrderId = parseEvents<string>(txResponse.events, "BidAvailable", "bidId")
		return {
			...txResponse,
			orderId: parseInt(simpleOrderId),
		}
	}
	throw new Error("Fcl is required for purchasing")
}

function calculateFees(price: BigNumber, fees: FlowFee[]): FlowFee[] {
	return fees.map(fee => {
		const value: BigNumber = toBigNumber(toBn(price.toString()).multipliedBy(fee.value).toString())
		return { account: fee.account, value }
	})
}
