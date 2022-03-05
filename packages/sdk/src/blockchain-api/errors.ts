type ContractError = Record<"englishAuction", Record<string, string>>

export function getErrorMessage(errorMessage: string, name: keyof ContractError): string {
	let response = ""
	Object.keys(contractErrorMessages[name]).forEach(k => {
		if (errorMessage.search(k) >= 0) {
			response = contractErrorMessages[name][k]
		}
	})
	return response || errorMessage
}

export const contractErrorMessages: ContractError = {
	englishAuction: {
		AU18: "payout: rate must be in range (0,1)",
		AU19: "payout: capability not available",
		AU11: "bid: broken item collection capability",
		AU17: "not found token in collection",
		AU12: "broken payout capability",
		AU28: "total payout rate must be equal to 1.0",
		AU35: "can't destroy non-empty lot",
		AU15: "broken token vault",
		AU14: "broken reward capability",
		AU13: "broken payout capability",
		AU16: "no valid payment receivers",
		AU34: "can't destroy non-empty bid",
		AU27: "too short duration",
		AU23: "too long duration",
		AU26: "too low minimum bid",
		AU25: "too low increment",
		AU24: "too low buyoutPrice",
		AU21: "bid price must be greater than minimumBid",
		AU22: "bid price must me greater than current bid price + increment",
		AU38: "the auction has not started yet",
		AU39: "the auction is already finished",
		AU37: "no bids",
		AU30: "auction is not over yet",
		AU36: "cancellation of the auction is prohibited",
		AU33: "can't cancel auction with bids",
	},
}
