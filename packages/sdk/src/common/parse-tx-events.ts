import type { FlowTransaction } from "../types/types"

type EventNames =
	| "Withdraw"
	| "Deposit"
	| "Mint"
	| "Destroy"
	| "ListingAvailable"
	| "ListingCompleted"
	| "CollectibleDestroyed"
	| "MomentDestroyed"
	| "Burn"
	| "BidAvailable"
	| "Minted"
	| "Changed"

export function parseEvents<T>(events: FlowTransaction["events"], eventName: EventNames, field: string): T {
	const event = events.find(e => {
		const [, , , event] = e.type.split(".")
		return event === eventName
	})
	if (!event) {
		throw new Error(`Event ${eventName} not found in transaction events`)
	}
	if (!(field in event.data)) {
		throw new Error(`Field ${field} not found in event data`)
	}
	return event.data[field]
}
