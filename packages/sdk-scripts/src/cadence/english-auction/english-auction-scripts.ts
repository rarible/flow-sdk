export const englishAuctionScriptsCode: Record<"lotIds" | "borrowLot", string> = {
	lotIds: `
	import EnglishAuction from address"

pub fun main(lotId: UInt64): [UInt64] {
    return EnglishAuction.borrowAuction().getIDs()
}
`,
	borrowLot: `
	import EnglishAuction from address

pub fun main(lotId: UInt64): &EnglishAuction.Lot? {
    return EnglishAuction.borrowAuction().borrowLot(lotId: lotId)
}

	`,
}
