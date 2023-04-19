export type FlowItemId = string & {
	__IS_FLOW_ITEM_ID__: true
}

export const flowItemIdRegExp = /^A\.0*x*[0-9a-f]{16}\.[A-Za-z0-9]{3,}:[0-9]{1,}/

export function toFlowItemId(itemId: string): FlowItemId {
	if (isFlowItemId(itemId)) {
		return itemId as FlowItemId
	}
	throw new Error("Invalid item id")
}

export function isFlowItemId(x: string): x is FlowItemId {
	return flowItemIdRegExp.test(x)
}

export function extractTokenId(x: FlowItemId): number {
	const splitted = x.split(":")
	if (splitted.length > 1) {
		return parseInt(splitted[1])
	}
	throw new Error("Invalid ItemId")
}
