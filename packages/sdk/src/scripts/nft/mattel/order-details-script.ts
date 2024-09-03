export const scriptOrderDetails = `
import NFTStorefrontV2 from address

// This script returns the details for a listing within a storefront
access(all)
fun main(storefrontAddress: Address, listingResourceID: UInt64): NFTStorefrontV2.ListingDetails {
    let storefrontRef = getAccount(storefrontAddress).capabilities.borrow<&{NFTStorefrontV2.StorefrontPublic}>(
            NFTStorefrontV2.StorefrontPublicPath
        ) ?? panic("Could not borrow public storefront from address")
    let listing = storefrontRef.borrowListing(listingResourceID: listingResourceID)
        ?? panic("No listing with that ID")

    return listing.getDetails()
}
`
