export const StorefrontCommon = {
	read_listing_details: `
import NFTStorefront from 0xNFTSTOREFRONT

// This script returns the details for a listing within a storefront

pub fun main(address: Address, listingResourceID: UInt64): NFTStorefront.ListingDetails {
    let storefrontRef = getAccount(address)
        .getCapability<&NFTStorefront.Storefront{NFTStorefront.StorefrontPublic}>(
            NFTStorefront.StorefrontPublicPath
        )
        .borrow()
        ?? panic("Could not borrow public storefront from address")

    let listing = storefrontRef.borrowListing(listingResourceID: listingResourceID)
        ?? panic("No item with that ID")

    return listing.getDetails()
}
`,
	read_storefront_ids: `
import NFTStorefront from 0xNFTSTOREFRONT

// This script returns an array of all the nft uuids for sale through a Storefront

pub fun main(address: Address): [UInt64] {
    let storefrontRef = getAccount(address)
        .getCapability<&NFTStorefront.Storefront{NFTStorefront.StorefrontPublic}>(
            NFTStorefront.StorefrontPublicPath
        )
        .borrow()
        ?? panic("Could not borrow public storefront from address")

    return storefrontRef.getListingIDs()
}
`,
	remove_item: `
import RaribleOrder from 0xCOMMONORDER
import NFTStorefront from 0xNFTSTOREFRONT

transaction (orderId: UInt64) {
    let listing: &NFTStorefront.Listing{NFTStorefront.ListingPublic}
    let storefront: &NFTStorefront.Storefront
    let orderAddress: Address

    prepare(acct: AuthAccount) {
        self.storefront = acct.borrow<&NFTStorefront.Storefront>(from: NFTStorefront.StorefrontStoragePath)
            ?? panic("Missing or mis-typed NFTStorefront Storefront")

        self.listing = self.storefront.borrowListing(listingResourceID: orderId)
                    ?? panic("No Offer with that ID in Storefront")

        self.orderAddress = acct.address
    }

    execute {
        RaribleOrder.removeOrder(
            storefront: self.storefront,
            orderId: orderId,
            orderAddress: self.orderAddress,
            listing: self.listing,
        )
    }
}
`,
	setup_account: `
import NFTStorefront from 0xNFTSTOREFRONT

// This transaction installs the Storefront ressource in an account.

transaction {
    prepare(acct: AuthAccount) {

        // If the account doesn't already have a Storefront
        if acct.borrow<&NFTStorefront.Storefront>(from: NFTStorefront.StorefrontStoragePath) == nil {

            // Create a new empty .Storefront
            let storefront <- NFTStorefront.createStorefront() as! @NFTStorefront.Storefront

            // save it to the account
            acct.save(<-storefront, to: NFTStorefront.StorefrontStoragePath)

            // create a public capability for the .Storefront
            acct.link<&NFTStorefront.Storefront{NFTStorefront.StorefrontPublic}>(NFTStorefront.StorefrontPublicPath, target: NFTStorefront.StorefrontStoragePath)
        }
    }
}
`,
}
