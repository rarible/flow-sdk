export const scriptOrderDetails = `
import NFTStorefrontV2 from address

// This script returns the details for a listing within a storefront

pub fun main(storefrontAddress: Address, listingResourceID: UInt64): NFTStorefrontV2.ListingDetails {
		let storefront = getAccount(storefrontAddress)
			.getCapability<&NFTStorefrontV2.Storefront{NFTStorefrontV2.StorefrontPublic}>(
					NFTStorefrontV2.StorefrontPublicPath
			)
			.borrow()
			?? panic("Could not borrow Storefront from provided address")

		// Borrow the listing
		let listing = storefront.borrowListing(listingResourceID: listingResourceID)
								?? panic("No Offer with that ID in Storefront")
		return listing.getDetails()
}
`
