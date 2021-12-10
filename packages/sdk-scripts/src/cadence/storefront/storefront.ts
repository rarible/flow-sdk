export const Storefront = {
	/**
	 * Sell Placeholders
	 * 0XNFTCONTRACTNAME - nft contract name to import
	 * 0XFTCONTRACTNAME - ft contract name to import
	 * 0XNFTPROVIDERPATH - nftProviderPath
	 * 0XVAULTPATH - vaultPath
	 * 0XCOLLECTIONSTORAGEPATH - collectionPath
	 */
	createSellOrder: {
		placeholders: {
			nftContractName: "0XNFTCONTRACTNAME",
			ftContractName: "0XFTCONTRACTNAME",
			vaultPath: "0XVAULTPATH",
			nftProviderPath: "0XNFTPROVIDERPATH",
			collectionStoragePath: "0XCOLLECTIONSTORAGEPATH",
		},
		code: `
	import 0XNFTCONTRACTNAME from "NoMatterWhat"
	import 0XFTCONTRACTNAME from "NoMatterWhat"
	import FungibleToken from "FungibleToken.cdc"
	import NonFungibleToken from "NonFungibleToken.cdc"
	import NFTStorefront from "NFTStorefront.cdc"

transaction(
    tokenId: UInt64,
    price: UFix64,
    originFees: {Address: UFix64}, //additional fees from other marketplace etc.
    royalties: {Address: UFix64},
    payments: {Address: UFix64}
) {
        let storefront: &NFTStorefront.Storefront
        let nftProvider: Capability<&{NonFungibleToken.Provider,NonFungibleToken.CollectionPublic}>

        prepare(seller: AuthAccount) {

            let nftProviderPath = /private/0XNFTPROVIDERPATH
            if !seller.getCapability<&{NonFungibleToken.Provider,NonFungibleToken.CollectionPublic}>(nftProviderPath)!.check() {
                seller.link<&{NonFungibleToken.Provider,NonFungibleToken.CollectionPublic}>(nftProviderPath, target: 0XCOLLECTIONSTORAGEPATH )
            }

            self.nftProvider = seller.getCapability<&{NonFungibleToken.Provider,NonFungibleToken.CollectionPublic}>(nftProviderPath)!
            assert(self.nftProvider.borrow() != nil, message: "Missing or mis-typed nft collection provider")

            if seller.borrow<&NFTStorefront.Storefront>(from: NFTStorefront.StorefrontStoragePath) == nil {
                let storefront <- NFTStorefront.createStorefront() as! @NFTStorefront.Storefront
                seller.save(<-storefront, to: NFTStorefront.StorefrontStoragePath)
                seller.link<&NFTStorefront.Storefront{NFTStorefront.StorefrontPublic}>(NFTStorefront.StorefrontPublicPath, target: NFTStorefront.StorefrontStoragePath)
            }

            self.storefront = seller.borrow<&NFTStorefront.Storefront>(from: NFTStorefront.StorefrontStoragePath)
                ?? panic("Missing or mis-typed NFTStorefront Storefront")
        }

        execute {
            let saleCuts: [NFTStorefront.SaleCut] = []
            let owner = self.storefront.owner!.address
            let vaultPath = /public/0XVAULTPATHReceiver
            var netto = price

            for k in originFees.keys {
                let amount = price * originFees[k]!
                let receiver = getAccount(k).getCapability<&{FungibleToken.Receiver}>(vaultPath)
                assert(receiver.borrow() != nil, message: "Missing or mis-typed fungible token receiver for originFee")
                saleCuts.append(NFTStorefront.SaleCut(receiver: receiver, amount: amount))
                netto = netto - amount
            }

            for k in royalties.keys {
                let amount = price * royalties[k]!
                let receiver = getAccount(k).getCapability<&{FungibleToken.Receiver}>(vaultPath)
                assert(receiver.borrow() != nil, message: "Missing or mis-typed fungible token receiver for royalty")
                saleCuts.append(NFTStorefront.SaleCut(receiver: receiver, amount: amount))
                netto = netto - amount
            }

            for k in payments.keys {
                let amount = netto * payments[k]!
                let receiver = getAccount(k).getCapability<&{FungibleToken.Receiver}>(vaultPath)
                assert(receiver.borrow() != nil, message: "Missing or mis-typed fungible token receiver for payment")
                saleCuts.append(NFTStorefront.SaleCut(receiver: receiver, amount: amount))
            }



            self.storefront.createListing(
                nftProviderCapability: self.nftProvider,
                nftType: Type<@0XNFTCONTRACTNAME.NFT>(),
                nftID: tokenId,
                salePaymentVaultType: Type<@0XFTCONTRACTNAME.Vault>(),
                saleCuts: saleCuts
            )

        }
}
	`,
	},
	/**
	 * Buy Placeholders
	 * 0XNFTCONTRACTNAME - nft contract name to import
	 * 0XFTCONTRACTNAME - ft contract name to import
	 * 0XVAULTPATH - vaultPath
	 * 0XNFTCOLLECTIONPUBLICPATH - nftCollectionPublicPath
	 * 0XCOLLECTIONSTORAGEPATH - collectionPath
	 */
	buy: {
		placeholders: {
			nftContractName: "0XNFTCONTRACTNAME",
			ftContractName: "0XFTCONTRACTNAME",
			vaultPath: "0XVAULTPATH",
			nftCollectionPublicPath: "0XNFTCOLLECTIONPUBLICPATH",
			collectionStoragePath: "0XCOLLECTIONSTORAGEPATH",
			tokenReceiver: "0XTOKENRECEIVERTYPE",
			linkArg: "0XLINKARG",
		},
		code: `
		import 0XNFTCONTRACTNAME from "NoMatterWhat"
import 0XFTCONTRACTNAME from "NoMatterWhat"
import FungibleToken from "FungibleToken.cdc"
import NFTStorefront from "NFTStorefront.cdc"
import NonFungibleToken from "NonFungibleToken.cdc"

/*
 * Buy item
 *
 */
transaction(orderId: UInt64, storefrontAddress: Address, fees: {Address: UFix64}) {
    let paymentVault: @FungibleToken.Vault
    let feeVault: @FungibleToken.Vault
    let storefront: &NFTStorefront.Storefront{NFTStorefront.StorefrontPublic}
    let tokenReceiver: 0XTOKENRECEIVERTYPE
    let feePayments: {Address: UFix64}

    prepare(acct: AuthAccount) {
        self.storefront = getAccount(storefrontAddress)
            .getCapability(NFTStorefront.StorefrontPublicPath)!
            .borrow<&NFTStorefront.Storefront{NFTStorefront.StorefrontPublic}>()
            ?? panic("Could not borrow Storefront from provided address")

        let listing = self.storefront.borrowListing(listingResourceID: orderId)
                    ?? panic("No Offer with that ID in Storefront")
        let price = listing.getDetails().salePrice
        var feesAmount = 0.0
				self.feePayments = {}

        for k in fees.keys {
            let amount = price * fees[k]!
            self.feePayments.insert(key: k, amount)
            feesAmount = feesAmount + amount
        }

        let mainVault = acct.borrow<&0XFTCONTRACTNAME.Vault>(from: /storage/0XVAULTPATHVault) //template
            ?? panic("Cannot borrow FlowToken vault from acct storage")
        self.paymentVault <- mainVault.withdraw(amount: price)
        self.feeVault <- mainVault.withdraw(amount: feesAmount)

				if acct.borrow<&0XNFTCONTRACTNAME.Collection>(from: 0XCOLLECTIONSTORAGEPATH) == nil {
						let collection <- 0XNFTCONTRACTNAME.createEmptyCollection() as! @0XNFTCONTRACTNAME.Collection
						acct.save(<-collection, to: 0XCOLLECTIONSTORAGEPATH)
						acct.link<&0XLINKARG>(0XNFTCOLLECTIONPUBLICPATH, target: 0XCOLLECTIONSTORAGEPATH)
				}

				self.tokenReceiver = acct.getCapability(0XNFTCOLLECTIONPUBLICPATH)
						.borrow<0XTOKENRECEIVERTYPE>()
						?? panic("Cannot borrow NFT collection receiver from acct")

    }

    execute {
				let vaultPath = /public/0XVAULTPATHReceiver //template

        // pay fee's
        for k in self.feePayments.keys {
            let receiver = getAccount(k).getCapability<&{FungibleToken.Receiver}>(vaultPath).borrow() ?? panic("Can't borrow receiver for fee payment")
            let payment <- self.feeVault.withdraw(amount: self.feePayments[k]!)
            receiver.deposit(from: <- payment)
        }

        // purchase item
        let item <- self.storefront.borrowListing(listingResourceID: orderId)!.purchase(payment: <- self.paymentVault)
        // transfer item to buyer
        self.tokenReceiver.deposit(token: <- item)
        destroy self.feeVault
    }
}
		`,
	},
	cancelOrder: {
		code: `
import NFTStorefront from "NFTStorefront.cdc"

transaction(orderId: UInt64) {

    let storefront: &NFTStorefront.Storefront{NFTStorefront.StorefrontPublic}

    prepare(acct: AuthAccount) {
        self.storefront = acct.getCapability(NFTStorefront.StorefrontPublicPath)!
            .borrow<&NFTStorefront.Storefront{NFTStorefront.StorefrontPublic}>()
            ?? panic("Could not borrow Storefront from provided address")
    }

    execute {
        self.storefront.removeListing(listingResourceID: orderId)
    }
}
		`,
	},
	updateOrder: {
		placeholders: {
			nftContractName: "0XNFTCONTRACTNAME",
			ftContractName: "0XFTCONTRACTNAME",
			nftProviderPath: "0XNFTPROVIDERPATH",
			vaultPath: "0XVAULTPATH",
			collectionStoragePath: "0XCOLLECTIONSTORAGEPATH",
		},
		code: `
		import 0XNFTCONTRACTNAME from "RaribleNFT.cdc" //template
		import 0XFTCONTRACTNAME from "FlowToken.cdc" //template
		import FungibleToken from "FungibleToken.cdc"
		import NonFungibleToken from "NonFungibleToken.cdc"
		import NFTStorefront from "NFTStorefront.cdc"

transaction(
    orderId: UInt64,
    tokenId: UInt64,
    price: UFix64,
    originFees: {Address: UFix64}, //additional fees from other marketplace etc.
    royalties: {Address: UFix64},
    payments: {Address: UFix64}
) {
        let storefront: &NFTStorefront.Storefront
        let nftProvider: Capability<&{NonFungibleToken.Provider,NonFungibleToken.CollectionPublic}>

        prepare(seller: AuthAccount) {

            let nftProviderPath = /private/0XNFTPROVIDERPATH // template
            if !seller.getCapability<&{NonFungibleToken.Provider,NonFungibleToken.CollectionPublic}>(nftProviderPath)!.check() {
                seller.link<&{NonFungibleToken.Provider,NonFungibleToken.CollectionPublic}>(nftProviderPath, target: 0XCOLLECTIONSTORAGEPATH /*template*/)
            }

            self.nftProvider = seller.getCapability<&{NonFungibleToken.Provider,NonFungibleToken.CollectionPublic}>(nftProviderPath)!
            assert(self.nftProvider.borrow() != nil, message: "Missing or mis-typed nft collection provider")

            if seller.borrow<&NFTStorefront.Storefront>(from: NFTStorefront.StorefrontStoragePath) == nil {
                let storefront <- NFTStorefront.createStorefront() as! @NFTStorefront.Storefront
                seller.save(<-storefront, to: NFTStorefront.StorefrontStoragePath)
                seller.link<&NFTStorefront.Storefront{NFTStorefront.StorefrontPublic}>(NFTStorefront.StorefrontPublicPath, target: NFTStorefront.StorefrontStoragePath)
            }

            self.storefront = seller.borrow<&NFTStorefront.Storefront>(from: NFTStorefront.StorefrontStoragePath)
                ?? panic("Missing or mis-typed NFTStorefront Storefront")
        }

        execute {
            let saleCuts: [NFTStorefront.SaleCut] = []
            let vaultPath = /public/0XVAULTPATHReceiver //template
            var netto = price

            for k in originFees.keys {
                let amount = price * originFees[k]!
                let receiver = getAccount(k).getCapability<&{FungibleToken.Receiver}>(vaultPath)
                assert(receiver.borrow() != nil, message: "Missing or mis-typed fungible token receiver for originFee")
                saleCuts.append(NFTStorefront.SaleCut(receiver: receiver, amount: amount))
                netto = netto - amount
            }

            for k in royalties.keys {
                let amount = price * royalties[k]!
                let receiver = getAccount(k).getCapability<&{FungibleToken.Receiver}>(vaultPath)
                assert(receiver.borrow() != nil, message: "Missing or mis-typed fungible token receiver for royalty")
                saleCuts.append(NFTStorefront.SaleCut(receiver: receiver, amount: amount))
                netto = netto - amount
            }

            for k in payments.keys {
                let amount = netto * payments[k]!
                let receiver = getAccount(k).getCapability<&{FungibleToken.Receiver}>(vaultPath)
                assert(receiver.borrow() != nil, message: "Missing or mis-typed fungible token receiver for payment")
                saleCuts.append(NFTStorefront.SaleCut(receiver: receiver, amount: amount))
            }


            //remove prev order
            self.storefront.removeListing(listingResourceID: orderId)
            //create new order with new price
            self.storefront.createListing(
                nftProviderCapability: self.nftProvider,
                nftType: Type<@0XNFTCONTRACTNAME.NFT>(), //template
                nftID: tokenId,
                salePaymentVaultType: Type<@0XFTCONTRACTNAME.Vault>(), //template
                saleCuts: saleCuts
            )

        }
}`,
	},
}
