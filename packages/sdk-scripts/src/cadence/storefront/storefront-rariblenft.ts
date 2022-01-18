export const StorefrontRaribleNFT = {
	sell_flow: `
import RaribleNFT from 0xRARIBLENFT
import RaribleOrder from 0xRARIBLEORDER
import FlowToken from 0xFLOWTOKEN
import FungibleToken from 0xFUNGIBLETOKEN
import NonFungibleToken from 0xNONFUNGIBLETOKEN
import NFTStorefront from 0xNFTSTOREFRONT

// Sell RaribleNFT token for FlowToken with NFTStorefront
//
transaction(tokenId: UInt64, price: UFix64, royalties: {Address: UFix64}) {
    let nftProvider: Capability<&{NonFungibleToken.Provider,NonFungibleToken.CollectionPublic}>
    let storefront: &NFTStorefront.Storefront

    prepare(acct: AuthAccount) {
        let nftProviderPath = /private/RaribleNFTProviderForNFTStorefront
        if !acct.getCapability<&{NonFungibleToken.Provider,NonFungibleToken.CollectionPublic}>(nftProviderPath)!.check() {
            acct.link<&{NonFungibleToken.Provider,NonFungibleToken.CollectionPublic}>(nftProviderPath, target: RaribleNFT.collectionStoragePath)
        }

        self.nftProvider = acct.getCapability<&{NonFungibleToken.Provider,NonFungibleToken.CollectionPublic}>(nftProviderPath)!
        assert(self.nftProvider.borrow() != nil, message: "Missing or mis-typed nft collection provider")

        if acct.borrow<&NFTStorefront.Storefront>(from: NFTStorefront.StorefrontStoragePath) == nil {
            let storefront <- NFTStorefront.createStorefront() as! @NFTStorefront.Storefront
            acct.save(<-storefront, to: NFTStorefront.StorefrontStoragePath)
            acct.link<&NFTStorefront.Storefront{NFTStorefront.StorefrontPublic}>(NFTStorefront.StorefrontPublicPath, target: NFTStorefront.StorefrontStoragePath)
        }
        self.storefront = acct.borrow<&NFTStorefront.Storefront>(from: NFTStorefront.StorefrontStoragePath)
            ?? panic("Missing or mis-typed NFTStorefront Storefront")
    }

    execute {
        let royaltiesPart: [RaribleOrder.PaymentPart] = []
        let extraCuts: [RaribleOrder.PaymentPart] = []

        for k in royalties.keys {
            royaltiesPart.append(RaribleOrder.PaymentPart(address: k, rate: royalties[k]!))
        }

        RaribleOrder.addOrder(
            storefront: self.storefront,
            nftProvider: self.nftProvider,
            nftType: Type<@RaribleNFT.NFT>(),
            nftId: tokenId,
            vaultPath: /public/flowTokenReceiver,
            vaultType: Type<@FlowToken.Vault>(),
            price: price,
            extraCuts: extraCuts,
            royalties: royaltiesPart
        )
    }
}
`,
	sell_fusd: `
import RaribleNFT from 0xRARIBLENFT
import RaribleOrder from 0xRARIBLEORDER
import FUSD from 0xFUSD
import FungibleToken from 0xFUNGIBLETOKEN
import NonFungibleToken from 0xNONFUNGIBLETOKEN
import NFTStorefront from 0xNFTSTOREFRONT

// Sell RaribleNFT token for FUSD with NFTStorefront
//
transaction(tokenId: UInt64, price: UFix64, royalties: {Address: UFix64}) {
    let nftProvider: Capability<&{NonFungibleToken.Provider,NonFungibleToken.CollectionPublic}>
    let storefront: &NFTStorefront.Storefront

    prepare(acct: AuthAccount) {
        let nftProviderPath = /private/RaribleNFTProviderForNFTStorefront
        if !acct.getCapability<&{NonFungibleToken.Provider,NonFungibleToken.CollectionPublic}>(nftProviderPath)!.check() {
            acct.link<&{NonFungibleToken.Provider,NonFungibleToken.CollectionPublic}>(nftProviderPath, target: RaribleNFT.collectionStoragePath)
        }

        self.nftProvider = acct.getCapability<&{NonFungibleToken.Provider,NonFungibleToken.CollectionPublic}>(nftProviderPath)!
        assert(self.nftProvider.borrow() != nil, message: "Missing or mis-typed nft collection provider")

        if acct.borrow<&NFTStorefront.Storefront>(from: NFTStorefront.StorefrontStoragePath) == nil {
            let storefront <- NFTStorefront.createStorefront() as! @NFTStorefront.Storefront
            acct.save(<-storefront, to: NFTStorefront.StorefrontStoragePath)
            acct.link<&NFTStorefront.Storefront{NFTStorefront.StorefrontPublic}>(NFTStorefront.StorefrontPublicPath, target: NFTStorefront.StorefrontStoragePath)
        }
        self.storefront = acct.borrow<&NFTStorefront.Storefront>(from: NFTStorefront.StorefrontStoragePath)
            ?? panic("Missing or mis-typed NFTStorefront Storefront")
    }

    execute {
        let royaltiesPart: [RaribleOrder.PaymentPart] = []
        let extraCuts: [RaribleOrder.PaymentPart] = []

        for k in royalties.keys {
            royaltiesPart.append(RaribleOrder.PaymentPart(address: k, rate: royalties[k]!))
        }

        RaribleOrder.addOrder(
            storefront: self.storefront,
            nftProvider: self.nftProvider,
            nftType: Type<@RaribleNFT.NFT>(),
            nftId: tokenId,
            vaultPath: /public/fusdReceiver,
            vaultType: Type<@FUSD.Vault>(),
            price: price,
            extraCuts: extraCuts,
            royalties: royaltiesPart
        )
    }
}
`,
	update_flow: `
import RaribleNFT from 0xRARIBLENFT
import RaribleOrder from 0xRARIBLEORDER
import FlowToken from 0xFLOWTOKEN
import FungibleToken from 0xFUNGIBLETOKEN
import NonFungibleToken from 0xNONFUNGIBLETOKEN
import NFTStorefront from 0xNFTSTOREFRONT

// Cancels order with [orderId], then open new order with same RaribleNFT token for FlowToken [price]
//
transaction(orderId: UInt64, price: UFix64, royalties: {Address: UFix64}) {
    let nftProvider: Capability<&{NonFungibleToken.Provider,NonFungibleToken.CollectionPublic}>
    let storefront: &NFTStorefront.Storefront
    let listing: &NFTStorefront.Listing{NFTStorefront.ListingPublic}
    let orderAddress: Address

    prepare(acct: AuthAccount) {
        let nftProviderPath = /private/RaribleNFTProviderForNFTStorefront
        if !acct.getCapability<&{NonFungibleToken.Provider,NonFungibleToken.CollectionPublic}>(nftProviderPath)!.check() {
            acct.link<&{NonFungibleToken.Provider,NonFungibleToken.CollectionPublic}>(nftProviderPath, target: RaribleNFT.collectionStoragePath)
        }

        self.nftProvider = acct.getCapability<&{NonFungibleToken.Provider,NonFungibleToken.CollectionPublic}>(nftProviderPath)!
        assert(self.nftProvider.borrow() != nil, message: "Missing or mis-typed nft collection provider")

        self.storefront = acct.borrow<&NFTStorefront.Storefront>(from: NFTStorefront.StorefrontStoragePath)
            ?? panic("Missing or mis-typed NFTStorefront Storefront")

        self.listing = self.storefront.borrowListing(listingResourceID: orderId)
            ?? panic("No Offer with that ID in Storefront")

        self.orderAddress = acct.address
    }

    execute {
        let details = self.listing.getDetails()
        let tokenId = details.nftID

				let royaltiesPart: [RaribleOrder.PaymentPart] = []
        let extraCuts: [RaribleOrder.PaymentPart] = []

        for k in royalties.keys {
            royaltiesPart.append(RaribleOrder.PaymentPart(address: k, rate: royalties[k]!))
        }


        RaribleOrder.removeOrder(
            storefront: self.storefront,
            orderId: orderId,
            orderAddress: self.orderAddress,
            listing: self.listing,
        )

        RaribleOrder.addOrder(
            storefront: self.storefront,
            nftProvider: self.nftProvider,
            nftType: details.nftType,
            nftId: details.nftID,
            vaultPath: /public/flowTokenReceiver,
            vaultType: Type<@FlowToken.Vault>(),
            price: price,
            extraCuts: extraCuts,
            royalties: royaltiesPart
        )
    }
}
`,
	update_fusd: `
import RaribleNFT from 0xRARIBLENFT
import RaribleOrder from 0xRARIBLEORDER
import FUSD from 0xFUSD
import FungibleToken from 0xFUNGIBLETOKEN
import NonFungibleToken from 0xNONFUNGIBLETOKEN
import NFTStorefront from 0xNFTSTOREFRONT

// Cancels order with [orderId], then open new order with same RaribleNFT token for FUSD [price]
//
transaction(orderId: UInt64, price: UFix64, royalties: {Address: UFix64}) {
    let nftProvider: Capability<&{NonFungibleToken.Provider,NonFungibleToken.CollectionPublic}>
    let storefront: &NFTStorefront.Storefront
    let listing: &NFTStorefront.Listing{NFTStorefront.ListingPublic}
    let orderAddress: Address

    prepare(acct: AuthAccount) {
        let nftProviderPath = /private/RaribleNFTProviderForNFTStorefront
        if !acct.getCapability<&{NonFungibleToken.Provider,NonFungibleToken.CollectionPublic}>(nftProviderPath)!.check() {
            acct.link<&{NonFungibleToken.Provider,NonFungibleToken.CollectionPublic}>(nftProviderPath, target: RaribleNFT.collectionStoragePath)
        }

        self.nftProvider = acct.getCapability<&{NonFungibleToken.Provider,NonFungibleToken.CollectionPublic}>(nftProviderPath)!
        assert(self.nftProvider.borrow() != nil, message: "Missing or mis-typed nft collection provider")

        self.storefront = acct.borrow<&NFTStorefront.Storefront>(from: NFTStorefront.StorefrontStoragePath)
            ?? panic("Missing or mis-typed NFTStorefront Storefront")

        self.listing = self.storefront.borrowListing(listingResourceID: orderId)
            ?? panic("No Offer with that ID in Storefront")

        self.orderAddress = acct.address
    }

    execute {
        let details = self.listing.getDetails()
        let tokenId = details.nftID

				let royaltiesPart: [RaribleOrder.PaymentPart] = []
        let extraCuts: [RaribleOrder.PaymentPart] = []

        for k in royalties.keys {
            royaltiesPart.append(RaribleOrder.PaymentPart(address: k, rate: royalties[k]!))
        }


        RaribleOrder.removeOrder(
            storefront: self.storefront,
            orderId: orderId,
            orderAddress: self.orderAddress,
            listing: self.listing,
        )

        RaribleOrder.addOrder(
            storefront: self.storefront,
            nftProvider: self.nftProvider,
            nftType: details.nftType,
            nftId: details.nftID,
            vaultPath: /public/fusdReceiver,
            vaultType: Type<@FUSD.Vault>(),
            price: price,
            extraCuts: extraCuts,
            royalties: royaltiesPart
        )
    }
}
`,
	buy_flow: `
import RaribleNFT from 0xRARIBLENFT
import RaribleOrder from 0xRARIBLEORDER
import FlowToken from 0xFLOWTOKEN
import FungibleToken from 0xFUNGIBLETOKEN
import NFTStorefront from 0xNFTSTOREFRONT
import NonFungibleToken from 0xNONFUNGIBLETOKEN

// Buy RaribleNFT token for FlowToken with NFTStorefront
//
transaction (orderId: UInt64, storefrontAddress: Address) {
    let listing: &NFTStorefront.Listing{NFTStorefront.ListingPublic}
    let paymentVault: @FungibleToken.Vault
    let storefront: &NFTStorefront.Storefront{NFTStorefront.StorefrontPublic}
    let tokenReceiver: &{NonFungibleToken.CollectionPublic,NonFungibleToken.Receiver}
    let buyerAddress: Address

    prepare(acct: AuthAccount) {
        self.storefront = getAccount(storefrontAddress)
            .getCapability(NFTStorefront.StorefrontPublicPath)!
            .borrow<&NFTStorefront.Storefront{NFTStorefront.StorefrontPublic}>()
            ?? panic("Could not borrow Storefront from provided address")

        self.listing = self.storefront.borrowListing(listingResourceID: orderId)
                    ?? panic("No Offer with that ID in Storefront")
        let price = self.listing.getDetails().salePrice

        let mainVault = acct.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)
            ?? panic("Cannot borrow FlowToken vault from acct storage")
        self.paymentVault <- mainVault.withdraw(amount: price)

        if acct.borrow<&RaribleNFT.Collection>(from: RaribleNFT.collectionStoragePath) == nil {
            let collection <- RaribleNFT.createEmptyCollection() as! @RaribleNFT.Collection
            acct.save(<-collection, to: RaribleNFT.collectionStoragePath)
            acct.link<&{NonFungibleToken.CollectionPublic,NonFungibleToken.Receiver}>(RaribleNFT.collectionPublicPath, target: RaribleNFT.collectionStoragePath)
        }

        self.tokenReceiver = acct.getCapability(RaribleNFT.collectionPublicPath)
            .borrow<&{NonFungibleToken.CollectionPublic,NonFungibleToken.Receiver}>()
            ?? panic("Cannot borrow NFT collection receiver from acct")

        self.buyerAddress = acct.address
    }

    execute {
        let item <- RaribleOrder.closeOrder(
            storefront: self.storefront,
            orderId: orderId,
            orderAddress: storefrontAddress,
            listing: self.listing,
            paymentVault: <- self.paymentVault,
            buyerAddress: self.buyerAddress
        )
        self.tokenReceiver.deposit(token: <-item)
    }
}
`,
	buy_fusd: `
import RaribleNFT from 0xRARIBLENFT
import RaribleOrder from 0xRARIBLEORDER
import FUSD from 0xFUSD
import FungibleToken from 0xFUNGIBLETOKEN
import NFTStorefront from 0xNFTSTOREFRONT
import NonFungibleToken from 0xNONFUNGIBLETOKEN

// Buy RaribleNFT token for FUSD with NFTStorefront
//
transaction (orderId: UInt64, storefrontAddress: Address) {
    let listing: &NFTStorefront.Listing{NFTStorefront.ListingPublic}
    let paymentVault: @FungibleToken.Vault
    let storefront: &NFTStorefront.Storefront{NFTStorefront.StorefrontPublic}
    let tokenReceiver: &{NonFungibleToken.CollectionPublic,NonFungibleToken.Receiver}
    let buyerAddress: Address

    prepare(acct: AuthAccount) {
        self.storefront = getAccount(storefrontAddress)
            .getCapability(NFTStorefront.StorefrontPublicPath)!
            .borrow<&NFTStorefront.Storefront{NFTStorefront.StorefrontPublic}>()
            ?? panic("Could not borrow Storefront from provided address")

        self.listing = self.storefront.borrowListing(listingResourceID: orderId)
                    ?? panic("No Offer with that ID in Storefront")
        let price = self.listing.getDetails().salePrice

        let mainVault = acct.borrow<&FUSD.Vault>(from: /storage/fusdVault)
            ?? panic("Cannot borrow FUSD vault from acct storage")
        self.paymentVault <- mainVault.withdraw(amount: price)

        if acct.borrow<&RaribleNFT.Collection>(from: RaribleNFT.collectionStoragePath) == nil {
            let collection <- RaribleNFT.createEmptyCollection() as! @RaribleNFT.Collection
            acct.save(<-collection, to: RaribleNFT.collectionStoragePath)
            acct.link<&{NonFungibleToken.CollectionPublic,NonFungibleToken.Receiver}>(RaribleNFT.collectionPublicPath, target: RaribleNFT.collectionStoragePath)
        }

        self.tokenReceiver = acct.getCapability(RaribleNFT.collectionPublicPath)
            .borrow<&{NonFungibleToken.CollectionPublic,NonFungibleToken.Receiver}>()
            ?? panic("Cannot borrow NFT collection receiver from acct")

        self.buyerAddress = acct.address
    }

    execute {
        let item <- RaribleOrder.closeOrder(
            storefront: self.storefront,
            orderId: orderId,
            orderAddress: storefrontAddress,
            listing: self.listing,
            paymentVault: <- self.paymentVault,
            buyerAddress: self.buyerAddress
        )
        self.tokenReceiver.deposit(token: <-item)
    }
}
`,
}
