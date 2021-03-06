export const openBidCommon = {
	readBidDetails: `
import RaribleOpenBid from address

// This script returns the details for a Bid within a OpenBid

pub fun main(account: Address, bidId: UInt64): RaribleOpenBid.BidDetails {
    let openBidRef = getAccount(account)
        .getCapability<&RaribleOpenBid.OpenBid{RaribleOpenBid.OpenBidPublic}>(
            RaribleOpenBid.OpenBidPublicPath
        )
        .borrow()
        ?? panic("Could not borrow public OpenBid from address")

    let Bid = openBidRef.borrowBid(bidId: bidId)
        ?? panic("No item with that ID")

    return Bid.getDetails()
}
`,
	readOpenBidIds: `
import RaribleOpenBid from address

// This script returns an array of all the nft uuids for sale through a OpenBid

pub fun main(account: Address): [UInt64] {
    let openBidRef = getAccount(account)
        .getCapability<&RaribleOpenBid.OpenBid{RaribleOpenBid.OpenBidPublic}>(
            RaribleOpenBid.OpenBidPublicPath
        )
        .borrow()
        ?? panic("Could not borrow public OpenBid from address")

    return openBidRef.getBidIds()
}
`,
}
