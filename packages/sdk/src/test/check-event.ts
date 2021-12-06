import type { FlowContractName, FlowTransaction } from "../types"

type EventNames =
	| "Withdraw"
	| "Deposit"
	| "Mint"
	| "Destroy"
	| "ListingAvailable"
	| "OrderAvailable"
	| "ListingCompleted"
	| "CollectibleDestroyed"
	| "MomentDestroyed"
	| "Burn"
	| "BidCompleted"
	| "BidAvailable"

export function checkEvent(txResult: FlowTransaction, eventName: EventNames, contractName?: FlowContractName) {
	const result = !!txResult.events.find(e => {
		const [, , name, event] = e.type.split(".")
		if (contractName) {
			return name === contractName && event === eventName
		}
		return event === eventName
	})
	expect(result).toBeTruthy()
}
