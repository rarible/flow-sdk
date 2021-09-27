export const motogpPackTransactions = {
	sell_pack: `
import FungibleToken from 0xFUNGIBLETOKEN
import NonFungibleToken from 0xNONFUNGIBLETOKEN
import FlowToken from 0xFLOWTOKEN
import NFTStorefront from 0xNFTSTOREFRONT
import CommonFee from 0xCOMMONFEE
import MotoGPPack from 0xMOTOGPPACK

transaction(saleItemID: UInt64, saleItemPrice: UFix64) {
    let nftProvider: Capability<&MotoGPPack.Collection{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>
    let storefront: &NFTStorefront.Storefront

    prepare(acct: AuthAccount) {
        let motoGpPackCollectionProviderPrivatePath = /private/motoGpPackCollectionProviderForNFTStorefront

        if !acct.getCapability<&MotoGPPack.Collection{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(motoGpPackCollectionProviderPrivatePath)!.check() {
            acct.link<&MotoGPPack.Collection{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(motoGpPackCollectionProviderPrivatePath, target: /storage/motogpPackCollection)
        }

        self.nftProvider = acct.getCapability<&MotoGPPack.Collection{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(motoGpPackCollectionProviderPrivatePath)!
        assert(self.nftProvider.borrow() != nil, message: "Missing or mis-typed MotoGPPack.Collection provider")

        if acct.borrow<&NFTStorefront.Storefront>(from: NFTStorefront.StorefrontStoragePath) == nil {
            let storefront <- NFTStorefront.createStorefront() as! @NFTStorefront.Storefront
            acct.save(<-storefront, to: NFTStorefront.StorefrontStoragePath)
            acct.link<&NFTStorefront.Storefront{NFTStorefront.StorefrontPublic}>(NFTStorefront.StorefrontPublicPath, target: NFTStorefront.StorefrontStoragePath)
        }

        self.storefront = acct.borrow<&NFTStorefront.Storefront>(from: NFTStorefront.StorefrontStoragePath)
            ?? panic("Missing or mis-typed NFTStorefront Storefront")
    }

    execute {
        // effective price: itemPrice + buyerFee
        var rest = saleItemPrice * (100.0 + CommonFee.buyerFee) / 100.0

        // create sale cut
        let createCut = fun (_ address: Address, _ amount: UFix64): NFTStorefront.SaleCut {
            let receiver = getAccount(address).getCapability<&{FungibleToken.Receiver}>(/public/flowTokenReceiver)
            assert(receiver.borrow() != nil, message: "Missing or mis-typed FlowToken receiver")
            rest = rest - amount
            return NFTStorefront.SaleCut(receiver: receiver, amount: amount)
        }

        // add fees
        let saleCuts = [
            createCut(CommonFee.feeAddress(), saleItemPrice * CommonFee.buyerFee / 100.0),
            createCut(CommonFee.feeAddress(), saleItemPrice * CommonFee.sellerFee / 100.0)
        ]

        // add seller
        saleCuts.append(createCut(self.nftProvider.address, rest))

        self.storefront.createSaleOffer(
            nftProviderCapability: self.nftProvider,
            nftType: Type<@MotoGPPack.NFT>(),
            nftID: saleItemID,
            salePaymentVaultType: Type<@FlowToken.Vault>(),
            saleCuts: saleCuts
        )
    }
}
`,
	buy_pack: `
import FungibleToken from 0xFUNGIBLETOKEN
import NonFungibleToken from 0xNONFUNGIBLETOKEN
import FlowToken from 0xFLOWTOKEN
import MotoGPPack from 0xMOTOGPPACK
import NFTStorefront from 0xNFTSTOREFRONT

transaction(saleOfferResourceID: UInt64, storefrontAddress: Address) {
    let paymentVault: @FungibleToken.Vault
    let motoGpPackCollection: &{MotoGPPack.IPackCollectionPublic}
    let storefront: &NFTStorefront.Storefront{NFTStorefront.StorefrontPublic}
    let saleOffer: &NFTStorefront.SaleOffer{NFTStorefront.SaleOfferPublic}

    prepare(acct: AuthAccount) {
        self.storefront = getAccount(storefrontAddress)
            .getCapability<&NFTStorefront.Storefront{NFTStorefront.StorefrontPublic}>(
                NFTStorefront.StorefrontPublicPath
            )!
            .borrow()
            ?? panic("Could not borrow Storefront from provided address")

        self.saleOffer = self.storefront.borrowSaleOffer(saleOfferResourceID: saleOfferResourceID)
                    ?? panic("No Offer with that ID in Storefront")
        let price = self.saleOffer.getDetails().salePrice

        let mainFlowVault = acct.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)
            ?? panic("Cannot borrow FlowToken vault from acct storage")
        self.paymentVault <- mainFlowVault.withdraw(amount: price)

        self.motoGpPackCollection = acct.getCapability<&{MotoGPPack.IPackCollectionPublic}>(/public/motogpPackCollection).borrow()
            ?? panic("Cannot borrow NFT collection receiver from account")
    }

    execute {
        let item <- self.saleOffer.accept(
            payment: <-self.paymentVault
        )

        self.motoGpPackCollection.deposit(token: <-item)

        self.storefront.cleanup(saleOfferResourceID: saleOfferResourceID)
        /* //-
        error: Execution failed:
        computation limited exceeded: 100
        */
        // Be kind and recycle
        //self.storefront.cleanup(saleOfferResourceID: saleOfferResourceID)
    }

    //- Post to check item is in collection?
}
`,
}
