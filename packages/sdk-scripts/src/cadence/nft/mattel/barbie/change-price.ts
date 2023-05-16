import type { MattelCollection} from "../mattel-contracts"
import {barbiePreparePartOfInit} from "./init"

export const barbieChangePriceTxCode = (collection: MattelCollection) => {
	let borrowMethod: string
	if (["BBxBarbiePack"].includes(collection)) {
		borrowMethod = "borrowPack"
	} else if (["BBxBarbieCard"].includes(collection)) {
		borrowMethod = "borrowCard"
	} else {
		throw new Error(`Unrecognized collection name (${collection}), expected BBxBarbiePack | BBxBarbieCard`)
	}
	return `
import FlowToken from 0xFlowToken
import FungibleToken from 0xFungibleToken
import NonFungibleToken from 0xNonFungibleToken
import MetadataViews from 0xMetadataViews
import NFTStorefrontV2 from 0xNFTStorefrontV2
import BBxBarbiePack from 0xBBxBarbiePack
import BBxBarbieCard from 0xBBxBarbieCard
import BBxBarbieToken from 0xBBxBarbieToken

transaction(removalListingResourceID: UInt64, saleItemID: UInt64, saleItemPrice: UFix64, customID: String?, commissionAmount: UFix64, expiry: UInt64, marketplacesAddress: [Address]) {
    let storefrontForRemove: &NFTStorefrontV2.Storefront{NFTStorefrontV2.StorefrontManager}

    //let flowReceiver: Capability<&AnyResource{FungibleToken.Receiver}>
    let fiatReceiver: Capability<&AnyResource{FungibleToken.Receiver}>
    let %nftContract%Provider: Capability<&AnyResource{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>
    let storefront: &NFTStorefrontV2.Storefront
    var saleCuts: [NFTStorefrontV2.SaleCut]
    var marketplacesCapability: [Capability<&AnyResource{FungibleToken.Receiver}>]

    prepare(acct: AuthAccount) {
${barbiePreparePartOfInit}

        self.storefrontForRemove = acct.borrow<&NFTStorefrontV2.Storefront{NFTStorefrontV2.StorefrontManager}>(from: NFTStorefrontV2.StorefrontStoragePath)
            ?? panic("Missing or mis-typed NFTStorefrontV2.Storefront")

        self.saleCuts = []
        self.marketplacesCapability = []

        // We need a provider capability, but one is not provided by default so we create one if needed.
        let %nftContract%ProviderPrivatePath = %nftPrivatePath%

        // Receiver for the sale cut.
        self.fiatReceiver = acct.getCapability<&{FungibleToken.Receiver}>(/public/flowTokenReceiver)
        assert(self.fiatReceiver.borrow() != nil, message: "Missing or mis-typed FiatToken receiver")
//        self.flowReceiver = acct.getCapability<&{FungibleToken.Receiver}>(/public/flowTokenReceiver)
//        assert(self.flowReceiver.borrow() != nil, message: "Missing or mis-typed FlowToken receiver")

        // Check if the Provider capability exists or not if \`no\` then create a new link for the same.
        if !acct.getCapability<&{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(%nftContract%ProviderPrivatePath).check() {
            acct.link<&{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(%nftContract%ProviderPrivatePath, target: %nftStoragePath%)
        }

        self.%nftContract%Provider = acct.getCapability<&{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(%nftContract%ProviderPrivatePath)
        let collection = acct
            .getCapability(%nftContract%.CollectionPublicPath)
            .borrow<&{%nftPublicTypeMin%}>()
            ?? panic("Could not borrow a reference to the collection")
        var totalRoyaltyCut = 0.0
        let effectiveSaleItemPrice = saleItemPrice - commissionAmount
        let nft = collection.${borrowMethod}(id: saleItemID)!
        // Check whether the NFT implements the MetadataResolver or not.
        if nft.getViews().contains(Type<MetadataViews.Royalties>()) {
            let royaltiesRef = nft.resolveView(Type<MetadataViews.Royalties>())?? panic("Unable to retrieve the royalties")
            let royalties = (royaltiesRef as! MetadataViews.Royalties).getRoyalties()
            for royalty in royalties {
                // TODO - Verify the type of the vault and it should exists
                self.saleCuts.append(NFTStorefrontV2.SaleCut(receiver: royalty.receiver, amount: royalty.cut * effectiveSaleItemPrice))
                totalRoyaltyCut = totalRoyaltyCut + royalty.cut * effectiveSaleItemPrice
            }
        }
        // Append the cut for the seller.
        self.saleCuts.append(NFTStorefrontV2.SaleCut(
            receiver: self.fiatReceiver,
            amount: effectiveSaleItemPrice - totalRoyaltyCut
        ))
        assert(self.%nftContract%Provider.borrow() != nil, message: "Missing or mis-typed %nftContract%.Collection provider")

        self.storefront = acct.borrow<&NFTStorefrontV2.Storefront>(from: NFTStorefrontV2.StorefrontStoragePath)
            ?? panic("Missing or mis-typed NFTStorefront Storefront")

        for marketplace in marketplacesAddress {
            // Here we are making a fair assumption that all given addresses would have
            // the capability to receive the \`FlowToken\`
            self.marketplacesCapability.append(getAccount(marketplace).getCapability<&{FungibleToken.Receiver}>(/public/flowTokenReceiver))
        }
    }

    execute {
        self.storefrontForRemove.removeListing(listingResourceID: removalListingResourceID)

        // Create listing
        self.storefront.createListing(
            nftProviderCapability: self.%nftContract%Provider,
            nftType: Type<@%nftContract%.NFT>(),
            nftID: saleItemID,
            salePaymentVaultType: Type<@FlowToken.Vault>(),
            saleCuts: self.saleCuts,
            marketplacesCapability: self.marketplacesCapability.length == 0 ? nil : self.marketplacesCapability,
            customID: customID,
            commissionAmount: commissionAmount,
            expiry: expiry
        )
    }
}
`
}
