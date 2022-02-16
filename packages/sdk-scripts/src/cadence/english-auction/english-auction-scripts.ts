export const englishAuctionScriptsCode: Record<"lotIds" | "borrowLot", string> = {
	lotIds: `
	import EnglishAuction from address"

pub fun main(lotId: UInt64): [UInt64] {
    return EnglishAuction.borrowAuction().getIDs()
}
`,
	borrowLot: `
import EnglishAuction from 0xENGLISHAUCTION

pub fun main(auctionId: UInt64): &EnglishAuction.Auction? {
    return EnglishAuction.borrow(auctionId: auctionId)
}

	`,
}
