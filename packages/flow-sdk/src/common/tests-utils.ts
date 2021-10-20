import { TxResult } from "./transaction"

type EventNames =
	"Withdraw"
	| "Deposit"
	| "Mint"
	| "Destroy"
	| "ListingAvailable"
	| "OrderAvailable"
	| "ListingCompleted"
type ContractNames =
	"CommonNFT"
	| "NonFungibleToken"
	| "FungibleToken"
	| "FUSD"
	| "FlowToken"
	| "NFTStorefront"
	| "CommonOrder"
	| "MotoGPCard"
	| "Evolution"
	| "CommonFee"
	| "TopShot"
	| "CommonNFT"
	| "LicensedNFT"

export function checkEvent(txResult: TxResult, eventName: EventNames, contractName?: ContractNames) {
	const result = !!txResult.events.find(e => {
		const [_, __, name, event] = e.type.split(".")
		if (contractName) {
			return name === contractName && event === eventName
		}
		return event === eventName
	})
	expect(result).toBeTruthy()
}
