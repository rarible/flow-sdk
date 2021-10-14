export const StorefrontTopshot = {
	borrow_nft: `
import TopShot from 0xTOPSHOT

// This script gets the metadata associated with a moment
// in a collection by looking up its playID and then searching
// for that play's metadata in the TopShot contract

// Parameters:
//
// account: The Flow Address of the account whose moment data needs to be read
// id: The unique ID for the moment whose data needs to be read

// Returns: {String: String} 
// A dictionary of all the play metadata associated
// with the specified moment

pub fun main(account: Address, id: UInt64): {String: String} {

    // get the public capability for the owner's moment collection
    // and borrow a reference to it
    let collectionRef = getAccount(account).getCapability(/public/MomentCollection)
        .borrow<&{TopShot.MomentCollectionPublic}>()
        ?? panic("Could not get public moment collection reference")

    // Borrow a reference to the specified moment
    let token = collectionRef.borrowMoment(id: id)
        ?? panic("Could not borrow a reference to the specified moment")

    // Get the moment's metadata to access its play and Set IDs
    let data = token.data

    // Use the moment's play ID 
    // to get all the metadata associated with that play
    let metadata = TopShot.getPlayMetaData(playID: data.playID) ?? panic("Play doesn't exist")

    log(metadata)

    return metadata
}
`,
	check: `
import NonFungibleToken from 0xNONFUNGIBLETOKEN
import TopShot from 0xTOPSHOT

// check CommonNFT collection is available on given address
//
pub fun main(address: Address): Bool {
    return getAccount(address)
        .getCapability<&{TopShot.MomentCollectionPublic}>(/public/MomentCollection)
        .check()
}
`,
	get_ids: `
import TopShot from 0xTOPSHOT

// This is the script to get a list of all the moments' ids an account owns
// Just change the argument to `getAccount` to whatever account you want
// and as long as they have a published Collection receiver, you can see
// the moments they own.

// Parameters:
//
// account: The Flow Address of the account whose moment data needs to be read

// Returns: [UInt64]
// list of all moments' ids an account owns

pub fun main(account: Address): [UInt64] {

    let acct = getAccount(account)

    let collectionRef = acct.getCapability(/public/MomentCollection)
                            .borrow<&{TopShot.MomentCollectionPublic}>()!

    log(collectionRef.getIDs())

    return collectionRef.getIDs()
}
`,
	sell_flow: `
import NonFungibleToken from 0xNONFUNGIBLETOKEN
import FlowToken from 0xFLOWTOKEN
import NFTStorefront from 0xNFTSTOREFRONT
import CommonOrder from 0xCOMMONORDER
import TopShot from 0xTOPSHOT
import CommonFee from 0xCOMMONFEE

// Sell TopShot moment for Flow with NFTStorefront
//
transaction(tokenId: UInt64, price: UFix64) {
    let nftProvider: Capability<&TopShot.Collection{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>
    let storefront: &NFTStorefront.Storefront

    prepare(acct: AuthAccount) {
        let collectionStoragePath = /storage/MomentCollection

        let nftProviderPath = /private/TopShotCollectionProviderForNFTStorefront
        if !acct.getCapability<&TopShot.Collection{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(nftProviderPath)!.check() {
            acct.link<&TopShot.Collection{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(nftProviderPath, target: collectionStoragePath)
        }
        self.nftProvider = acct.getCapability<&TopShot.Collection{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(nftProviderPath)!
        assert(self.nftProvider.borrow() != nil, message: "Missing or mis-typed TopShot.Collection provider")

        if acct.borrow<&NFTStorefront.Storefront>(from: NFTStorefront.StorefrontStoragePath) == nil {
            let storefront <- NFTStorefront.createStorefront() as! @NFTStorefront.Storefront
            acct.save(<-storefront, to: NFTStorefront.StorefrontStoragePath)
            acct.link<&NFTStorefront.Storefront{NFTStorefront.StorefrontPublic}>(NFTStorefront.StorefrontPublicPath, target: NFTStorefront.StorefrontStoragePath)
        }
        self.storefront = acct.borrow<&NFTStorefront.Storefront>(from: NFTStorefront.StorefrontStoragePath)
            ?? panic("Missing or mis-typed NFTStorefront Storefront")
    }

    execute {
        let topshotFeeAddress = CommonFee.feeAddress() // TODO Replace with TopShot fee address
        let topshotFeeRate = 0.05

        CommonOrder.addOrder(
            storefront: self.storefront,
            nftProvider: self.nftProvider,
            nftType: Type<@TopShot.NFT>(),
            nftId: tokenId,
            vaultPath: /public/flowTokenReceiver,
            vaultType: Type<@FlowToken.Vault>(),
            price: price,
            extraCuts: [CommonOrder.PaymentPart(address: topshotFeeAddress, rate: topshotFeeRate)],
            royalties: []
        )
    }
}
`,
	sell_fusd: `
import NonFungibleToken from 0xNONFUNGIBLETOKEN
import FUSD from 0xFUSD
import NFTStorefront from 0xNFTSTOREFRONT
import CommonOrder from 0xCOMMONORDER
import TopShot from 0xTOPSHOT
import CommonFee from 0xCOMMONFEE

// Sell TopShot moment for FUSD with NFTStorefront
//
transaction(tokenId: UInt64, price: UFix64) {
    let nftProvider: Capability<&TopShot.Collection{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>
    let storefront: &NFTStorefront.Storefront

    prepare(acct: AuthAccount) {
        let collectionStoragePath = /storage/MomentCollection

        let nftProviderPath = /private/TopShotCollectionProviderForNFTStorefront
        if !acct.getCapability<&TopShot.Collection{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(nftProviderPath)!.check() {
            acct.link<&TopShot.Collection{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(nftProviderPath, target: collectionStoragePath)
        }
        self.nftProvider = acct.getCapability<&TopShot.Collection{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(nftProviderPath)!
        assert(self.nftProvider.borrow() != nil, message: "Missing or mis-typed TopShot.Collection provider")

        if acct.borrow<&NFTStorefront.Storefront>(from: NFTStorefront.StorefrontStoragePath) == nil {
            let storefront <- NFTStorefront.createStorefront() as! @NFTStorefront.Storefront
            acct.save(<-storefront, to: NFTStorefront.StorefrontStoragePath)
            acct.link<&NFTStorefront.Storefront{NFTStorefront.StorefrontPublic}>(NFTStorefront.StorefrontPublicPath, target: NFTStorefront.StorefrontStoragePath)
        }
        self.storefront = acct.borrow<&NFTStorefront.Storefront>(from: NFTStorefront.StorefrontStoragePath)
            ?? panic("Missing or mis-typed NFTStorefront Storefront")
    }

    execute {
        let topshotFeeAddress = CommonFee.feeAddress() // TODO Replace with TopShot fee address
        let topshotFeeRate = 0.05

        CommonOrder.addOrder(
            storefront: self.storefront,
            nftProvider: self.nftProvider,
            nftType: Type<@TopShot.NFT>(),
            nftId: tokenId,
            vaultPath: /public/fusdReceiver,
            vaultType: Type<@FUSD.Vault>(),
            price: price,
            extraCuts: [CommonOrder.PaymentPart(address: topshotFeeAddress, rate: topshotFeeRate)],
            royalties: []
        )
    }
}
`,
	buy_flow: `
import FungibleToken from 0xFUNGIBLETOKEN
import NonFungibleToken from 0xNONFUNGIBLETOKEN
import FlowToken from 0xFLOWTOKEN
import TopShot from 0xTOPSHOT
import NFTStorefront from 0xNFTSTOREFRONT

transaction(listingResourceID: UInt64, storefrontAddress: Address) {
    let paymentVault: @FungibleToken.Vault
    let collection: &{TopShot.MomentCollectionPublic}
    let storefront: &NFTStorefront.Storefront{NFTStorefront.StorefrontPublic}
    let listing: &NFTStorefront.Listing{NFTStorefront.ListingPublic}

    prepare(acct: AuthAccount) {
        let collectionPublicPath = /public/MomentCollection
        let collectionStoragePath = /storage/MomentCollection

        self.storefront = getAccount(storefrontAddress)
            .getCapability<&NFTStorefront.Storefront{NFTStorefront.StorefrontPublic}>(
                NFTStorefront.StorefrontPublicPath
            )!
            .borrow()
            ?? panic("Could not borrow Storefront from provided address")

        self.listing = self.storefront.borrowListing(listingResourceID: listingResourceID)
                    ?? panic("No Offer with that ID in Storefront")
        let price = self.listing.getDetails().salePrice

        let mainFlowVault = acct.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)
            ?? panic("Cannot borrow FlowToken vault from acct storage")
        self.paymentVault <- mainFlowVault.withdraw(amount: price)

        if acct.borrow<&TopShot.Collection>(from: collectionStoragePath) == nil {
            let collection <- TopShot.createEmptyCollection() as! @TopShot.Collection
            acct.save(<-collection, to: collectionStoragePath)
            acct.link<&{TopShot.MomentCollectionPublic}>(collectionPublicPath, target: collectionStoragePath)
        }

        self.collection = acct.getCapability<&{TopShot.MomentCollectionPublic}>(collectionPublicPath).borrow()
            ?? panic("Cannot borrow NFT collection receiver from account")
    }

    execute {
        let item <- self.listing.purchase(payment: <-self.paymentVault)
        self.collection.deposit(token: <-item)
        self.storefront.cleanup(listingResourceID: listingResourceID)
    }
}
`,
	buy_fusd: `
import FungibleToken from 0xFUNGIBLETOKEN
import NonFungibleToken from 0xNONFUNGIBLETOKEN
import FUSD from 0xFUSD
import TopShot from 0xTOPSHOT
import NFTStorefront from 0xNFTSTOREFRONT

transaction(listingResourceID: UInt64, storefrontAddress: Address) {
    let paymentVault: @FungibleToken.Vault
    let collection: &{TopShot.MomentCollectionPublic}
    let storefront: &NFTStorefront.Storefront{NFTStorefront.StorefrontPublic}
    let listing: &NFTStorefront.Listing{NFTStorefront.ListingPublic}

    prepare(acct: AuthAccount) {
        let collectionPublicPath = /public/MomentCollection
        let collectionStoragePath = /storage/MomentCollection

        self.storefront = getAccount(storefrontAddress)
            .getCapability<&NFTStorefront.Storefront{NFTStorefront.StorefrontPublic}>(
                NFTStorefront.StorefrontPublicPath
            )!
            .borrow()
            ?? panic("Could not borrow Storefront from provided address")

        self.listing = self.storefront.borrowListing(listingResourceID: listingResourceID)
                    ?? panic("No Offer with that ID in Storefront")
        let price = self.listing.getDetails().salePrice

        let mainFlowVault = acct.borrow<&FUSD.Vault>(from: /storage/fusdVault)
            ?? panic("Cannot borrow FUSD vault from acct storage")
        self.paymentVault <- mainFlowVault.withdraw(amount: price)

        if acct.borrow<&TopShot.Collection>(from: collectionStoragePath) == nil {
            let collection <- TopShot.createEmptyCollection() as! @TopShot.Collection
            acct.save(<-collection, to: collectionStoragePath)
            acct.link<&{TopShot.MomentCollectionPublic}>(collectionPublicPath, target: collectionStoragePath)
        }

        self.collection = acct.getCapability<&{TopShot.MomentCollectionPublic}>(collectionPublicPath).borrow()
            ?? panic("Cannot borrow NFT collection receiver from account")
    }

    execute {
        let item <- self.listing.purchase(payment: <-self.paymentVault)
        self.collection.deposit(token: <-item)
        self.storefront.cleanup(listingResourceID: listingResourceID)
    }
}
`,

}