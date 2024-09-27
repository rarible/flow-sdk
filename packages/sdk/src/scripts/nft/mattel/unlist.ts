
export const txUnlistItemStorefrontV2: string = `
import NFTStorefrontV2 from 0xNFTStorefrontV2

transaction(listingResourceID: UInt64) {
    let storefront: auth(NFTStorefrontV2.RemoveListing) &{NFTStorefrontV2.StorefrontManager}

    prepare(acct: auth(BorrowValue) &Account) {
        self.storefront = acct.storage.borrow<auth(NFTStorefrontV2.RemoveListing) &NFTStorefrontV2.Storefront>(
                from: NFTStorefrontV2.StorefrontStoragePath
            ) ?? panic("Missing or mis-typed NFTStorefront.Storefront")
    }

    execute {
        self.storefront.removeListing(listingResourceID: listingResourceID)
    }
}
`
