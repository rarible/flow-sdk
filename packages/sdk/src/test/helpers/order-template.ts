import type { FlowAsset, FlowOrder } from "@rarible/flow-api-client"
import type { BigNumber } from "@rarible/types"
import { FLOW_ZERO_ADDRESS, toBigNumber } from "@rarible/types"
import {FlowOrderStatus} from "@rarible/flow-api-client"
import type { FlowItemId } from "../../common/item"
import { extractTokenId } from "../../common/item"
import { toFlowContractAddress } from "../../common/flow-address"

export function getTestOrderTmplate(type: "sell" | "bid", orderId: string, itemId: FlowItemId, price: BigNumber): FlowOrder {
	const left: FlowAsset = {
		"@type": "nft",
		contract: toFlowContractAddress(`A.${FLOW_ZERO_ADDRESS}.NFT`),
		value: toBigNumber("1"),
		tokenId: toBigNumber(extractTokenId(itemId).toString()),
	}
	const right: FlowAsset = {
		"@type": "fungible",
		contract: toFlowContractAddress(`A.${FLOW_ZERO_ADDRESS}.Fungible`),
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
		dbUpdatedAt: "",
		fill: toBigNumber("0"),
		cancelled: false,
		createdAt: "2019-08-24T14:15:22Z",
		lastUpdateAt: "2019-08-24T14:15:22Z",
		amount: toBigNumber("1"),
		priceUsd: toBigNumber("0"),
		makeStock: toBigNumber("0"),
		start: "2019-08-24T14:15:22Z",
		end: "2019-08-24T14:15:22Z",
		status: FlowOrderStatus.ACTIVE,
	}
}
