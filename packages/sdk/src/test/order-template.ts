import type { FlowAsset, FlowOrder } from "@rarible/flow-api-client"
import { FlowOrderStatusEnum } from "@rarible/flow-api-client"
import type { BigNumber } from "@rarible/types"
import { FLOW_ZERO_ADDRESS, toBigNumber } from "@rarible/types"
import type { FlowItemId } from "../types/item"
import { extractTokenId } from "../types/item"
import { toFlowContractAddress } from "../types/contract-address"

export function getTestOrderTmplate(type: "sell" | "bid", orderId: number, itemId: FlowItemId, price: BigNumber): FlowOrder {
	const left: FlowAsset = {
		"@type": "nft",
		contract: toFlowContractAddress(itemId.split(":")[0]),
		value: toBigNumber("1"),
		tokenId: toBigNumber(extractTokenId(itemId).toString()),
	}
	const right: FlowAsset = {
		"@type": "fungible",
		contract: toFlowContractAddress("A.0x0000000000000000.FlowToken"),
		value: price,
	}
	return {
		id: orderId,
		itemId,
		collection: toFlowContractAddress(itemId.split(":")[0]),
		maker: FLOW_ZERO_ADDRESS,
		taker: FLOW_ZERO_ADDRESS,
		make: type === "sell" ? left : right,
		take: type === "sell" ? right : left,
		data: {
			originalFees: [],
			payouts: [],
		},
		fill: toBigNumber("0"),
		cancelled: false,
		createdAt: "2019-08-24T14:15:22Z",
		lastUpdateAt: "2019-08-24T14:15:22Z",
		amount: toBigNumber("1"),
		offeredNftId: "string",
		priceUsd: toBigNumber("0"),
		makeStock: toBigNumber("0"),
		start: "2019-08-24T14:15:22Z",
		end: "2019-08-24T14:15:22Z",
		status: FlowOrderStatusEnum.ACTIVE,
	}
}
