import type { FlowAsset, FlowOrder } from "@rarible/flow-api-client"
import type { BigNumberLike } from "@rarible/types"
import { FLOW_ZERO_ADDRESS, toBigNumberLike, toFlowContractAddress } from "@rarible/types"
import {FlowOrderStatus} from "@rarible/flow-api-client"
import type { FlowItemId } from "../../common/item"
import { extractTokenId } from "../../common/item"

export function getTestOrderTmplate(type: "sell" | "bid", orderId: string, itemId: FlowItemId, price: BigNumberLike): FlowOrder {
	const left: FlowAsset = {
		"@type": "nft",
		contract: toFlowContractAddress(`A.${FLOW_ZERO_ADDRESS}.NFT`),
		value: toBigNumberLike("1"),
		tokenId: toBigNumberLike(extractTokenId(itemId).toString()),
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
		fill: toBigNumberLike("0"),
		cancelled: false,
		createdAt: "2019-08-24T14:15:22Z",
		lastUpdateAt: "2019-08-24T14:15:22Z",
		amount: toBigNumberLike("1"),
		priceUsd: toBigNumberLike("0"),
		makeStock: toBigNumberLike("0"),
		start: "2019-08-24T14:15:22Z",
		end: "2019-08-24T14:15:22Z",
		status: FlowOrderStatus.ACTIVE,
	}
}
