export const Storefront = {
	createSellOrder: `
	import FungibleToken from address
import NonFungibleToken from address
import NFTStorefront from address
import @ftContract from address
import @nftContract from address

// List @nftContract item
//
//   tokenId - @nftContract item id for sale
//   parts - all payments after complete order {address:amount}
//
transaction(tokenId: UInt64, parts: {Address: UFix64}) {
    let storefront: &NFTStorefront.Storefront
    let nftProvider: Capability<&{NonFungibleToken.Provider,NonFungibleToken.CollectionPublic}>

    prepare(account: AuthAccount) {
        if !account.getCapability<@nftPrivateType>(@nftPrivatePath)!.check() {
            account.link<@nftPrivateType>(@nftPrivatePath, target: @nftStoragePath)
        }
        self.nftProvider = account.getCapability<@nftPrivateType>(@nftPrivatePath)
        assert(self.nftProvider.borrow() != nil, message: "Missing or mis-typed nft collection provider")

        if let storefront = account.borrow<&NFTStorefront.Storefront>(from: NFTStorefront.StorefrontStoragePath) {
            self.storefront = storefront
        } else {
            let storefront <- NFTStorefront.createStorefront()
            self.storefront = &storefront as &NFTStorefront.Storefront
            account.save(<-storefront, to: NFTStorefront.StorefrontStoragePath)
            account.link<&NFTStorefront.Storefront{NFTStorefront.StorefrontPublic}>(NFTStorefront.StorefrontPublicPath, target: NFTStorefront.StorefrontStoragePath)
        }
    }

    execute {
        let cuts: [NFTStorefront.SaleCut] = []
        for address in parts.keys {
            let receiver = getAccount(address).getCapability<&{FungibleToken.Receiver}>(@ftPublicPath)
            assert(receiver.check(), message: "Missing or mis-typed fungible token receiver")
            let cut = NFTStorefront.SaleCut(receiver: receiver, amount: parts[address]!)
            cuts.append(cut)
        }

        self.storefront.createListing(
            nftProviderCapability: self.nftProvider,
            nftType: Type<@@nftContract.NFT>(),
            nftID: tokenId,
            salePaymentVaultType: Type<@@ftContract.Vault>(),
            saleCuts: cuts
        )
    }
}

	`,
	/**
	 * Buy Placeholders
	 * 0XNFTCONTRACTNAME - nft contract name to import
	 * 0XFTCONTRACTNAME - ft contract name to import
	 * 0XVAULTPATH - vaultPath
	 * 0XNFTCOLLECTIONPUBLICPATH - nftCollectionPublicPath
	 * 0XCOLLECTIONSTORAGEPATH - collectionPath
	 */
	buy: `
	import FungibleToken from address
import NonFungibleToken from address
import NFTStorefront from address
import @ftContract from address
import @nftContract from address

// Buy @nftContract item
//
//   orderId - NFTStorefront listingResourceID
//   storefrontAddress - seller address
//   parts - buyer payments {address:amount}
//
transaction(orderId: UInt64, storefrontAddress: Address, parts: {Address:UFix64}) {
    let storefront: &NFTStorefront.Storefront{NFTStorefront.StorefrontPublic}
    let listing: &NFTStorefront.Listing{NFTStorefront.ListingPublic}
    let paymentVault: @FungibleToken.Vault
    let nftCollection: &{NonFungibleToken.Receiver}

    prepare(account: AuthAccount) {
        if account.borrow<&@nftStorageType>(from: @nftStoragePath) == nil {
            let collection <- @nftContract.createEmptyCollection() as! @@nftStorageType
            account.save(<-collection, to: @nftStoragePath)
            account.link<@nftPublicType>(@nftPublicPath, target: @nftStoragePath)
        }
        self.storefront = getAccount(storefrontAddress)
            .getCapability(NFTStorefront.StorefrontPublicPath)
            .borrow<&NFTStorefront.Storefront{NFTStorefront.StorefrontPublic}>()
            ?? panic("Could not borrow Storefront from provided address")

        self.listing = self.storefront.borrowListing(listingResourceID: orderId)
                    ?? panic("No Offer with that ID in Storefront")
        var amount = self.listing.getDetails().salePrice
        for address in parts.keys {
            amount = amount + parts[address]!
        }

        let mainVault = account.borrow<&FungibleToken.Vault>(from: @ftStoragePath)
            ?? panic("Cannot borrow @ftContract vault from account storage")
        self.paymentVault <- mainVault.withdraw(amount: amount)

        self.nftCollection = account.borrow<&{NonFungibleToken.Receiver}>(from: @nftStoragePath)
            ?? panic("Cannot borrow NFT collection receiver from account")
    }

    execute {
        for address in parts.keys {
            let receiver = getAccount(address).getCapability<&{FungibleToken.Receiver}>(@ftPublicPath)
            assert(receiver.check(), message: "Cannot borrow @ftContract receiver")
            let part <- self.paymentVault.withdraw(amount: parts[address]!)
            receiver.borrow()!.deposit(from: <- part)
        }

        let item <- self.listing.purchase(payment: <-self.paymentVault)
        self.nftCollection.deposit(token: <-item)
        self.storefront.cleanup(listingResourceID: orderId)
    }
}

	`,
	cancelOrder: `
import NFTStorefront from address

transaction(orderId: UInt64) {

    let storefront: &NFTStorefront.Storefront

    prepare(account: AuthAccount) {
        self.storefront = account.borrow<&NFTStorefront.Storefront>(from: NFTStorefront.StorefrontStoragePath)
            ?? panic("Could not borrow Storefront from account")
    }

    execute {
        self.storefront.removeListing(listingResourceID: orderId)
    }
}
		`,
	updateOrder: `
	import FungibleToken from address
import NonFungibleToken from address
import NFTStorefront from address
import @ftContract from address
import @nftContract from address

// Relist @nftContract item
//
//   orderId - replacing NFTStorefront listingResourceID
//   parts - all payments after complete order {address:amount}
//
transaction(orderId: UInt64, parts: {Address: UFix64}) {
    let storefront: &NFTStorefront.Storefront
    let details: NFTStorefront.ListingDetails
    let nftProvider: Capability<&{NonFungibleToken.Provider,NonFungibleToken.CollectionPublic}>

    prepare(account: AuthAccount) {
        if !account.getCapability<@nftPrivateType>(@nftPrivatePath)!.check() {
            account.link<@nftPrivateType>(@nftPrivatePath, target: @nftStoragePath)
        }
        self.nftProvider = account.getCapability<@nftPrivateType>(@nftPrivatePath)
        assert(self.nftProvider.borrow() != nil, message: "Missing or mis-typed nft collection provider")

        if let storefront = account.borrow<&NFTStorefront.Storefront>(from: NFTStorefront.StorefrontStoragePath) {
            self.storefront = storefront
        } else {
            let storefront <- NFTStorefront.createStorefront()
            self.storefront = &storefront as &NFTStorefront.Storefront
            account.save(<-storefront, to: NFTStorefront.StorefrontStoragePath)
            account.link<&NFTStorefront.Storefront{NFTStorefront.StorefrontPublic}>(NFTStorefront.StorefrontPublicPath, target: NFTStorefront.StorefrontStoragePath)
        }

        let listing = self.storefront.borrowListing(listingResourceID: orderId)
            ?? panic("No Offer with that ID in Storefront")
        self.details = listing.getDetails()
    }

    execute {
        self.storefront.removeListing(listingResourceID: orderId)

        let cuts: [NFTStorefront.SaleCut] = []
        for address in parts.keys {
            let receiver = getAccount(address).getCapability<&{FungibleToken.Receiver}>(@ftPublicPath)
            assert(receiver.check(), message: "Missing or mis-typed fungible token receiver")
            let cut = NFTStorefront.SaleCut(receiver: receiver, amount: parts[address]!)
            cuts.append(cut)
        }

        self.storefront.createListing(
            nftProviderCapability: self.nftProvider,
            nftType: self.details.nftType,
            nftID: self.details.nftID,
            salePaymentVaultType: Type<@@ftContract.Vault>(),
            saleCuts: cuts
        )
    }
}

	`,
}
