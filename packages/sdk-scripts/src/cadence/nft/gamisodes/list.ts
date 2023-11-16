import {
	FungibleToken,
	MetadataViews,
	NFTStorefrontV2,
	NonFungibleToken,
} from "../contracts"
import type {Currency} from "../common"
import {getVaultInitTx, vaultOptions} from "../init-vault"
import {gamisodesRawInitPart} from "./init"

export const gamisodesListTxCode = (currency: Currency) => {
	return `
import %ftContract% from 0x%ftContract%
import FungibleToken from 0xFungibleToken
import NonFungibleToken from 0xNonFungibleToken
import MetadataViews from 0xMetadataViews
import NFTStorefrontV2 from 0xNFTStorefrontV2
import TokenForwarding from 0xTokenForwarding
import Gamisodes from 0xGamisodes
import NiftoryNFTRegistry from 0xNiftoryNFTRegistry
import NiftoryNonFungibleToken from 0xNiftoryNonFungibleToken

transaction(saleItemID: UInt64, saleItemPrice: UFix64, customID: String?, commissionAmount: UFix64, expiry: UInt64, marketplacesAddress: [Address]) {
    let fiatReceiver: Capability<&AnyResource{${FungibleToken.name}.Receiver}>
    let %nftContract%Provider: Capability<&AnyResource{${NonFungibleToken.name}.Provider, ${NonFungibleToken.name}.CollectionPublic}>
    let storefront: &${NFTStorefrontV2.name}.Storefront
    var saleCuts: [${NFTStorefrontV2.name}.SaleCut]
    var marketplacesCapability: [Capability<&AnyResource{${FungibleToken.name}.Receiver}>]

    prepare(acct: AuthAccount) {
${currency === "USDC" ? getVaultInitTx(vaultOptions["FiatToken"]): ""}
${gamisodesRawInitPart}

        self.saleCuts = []
        self.marketplacesCapability = []

        // We need a provider capability, but one is not provided by default so we create one if needed.
        let %nftContract%ProviderPrivatePath = %nftPrivatePath%

        // Receiver for the sale cut.
        self.fiatReceiver = acct.getCapability<&{${FungibleToken.name}.Receiver}>(%ftPublicPath%)
        assert(self.fiatReceiver.borrow() != nil, message: "Missing or mis-typed FT receiver")

        // Check if the Provider capability exists or not if then create a new link for the same.
        if !acct.getCapability<&{NonFungibleToken.Provider, NonFungibleToken.Receiver, NonFungibleToken.CollectionPublic, MetadataViews.ResolverCollection, NiftoryNonFungibleToken.CollectionPublic}>(%nftContract%ProviderPrivatePath).check() {
            acct.link<&{NonFungibleToken.Provider, NiftoryNonFungibleToken.CollectionPrivate}>(%nftContract%ProviderPrivatePath, target: %nftStoragePath%)
        }

        self.%nftContract%Provider = acct.getCapability<&{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(%nftContract%ProviderPrivatePath)
        let collection = acct
            .getCapability(%nftPublicPath%)
            .borrow<&{%nftPublicTypeMin%}>()
            ?? panic("Could not borrow a reference to the collection")
        var totalRoyaltyCut = 0.0
        let effectiveSaleItemPrice = saleItemPrice - commissionAmount
        let nft = collection.borrowNFT(id: saleItemID)!
        // Check whether the NFT implements the MetadataResolver or not.
        if nft.getViews().contains(Type<${MetadataViews.name}.Royalties>()) {
            let royaltiesRef = nft.resolveView(Type<${MetadataViews.name}.Royalties>())?? panic("Unable to retrieve the royalties")
            let royalties = (royaltiesRef as! ${MetadataViews.name}.Royalties).getRoyalties()
            for royalty in royalties {
                // TODO - Verify the type of the vault and it should exists
                self.saleCuts.append(${NFTStorefrontV2.name}.SaleCut(receiver: royalty.receiver, amount: royalty.cut * effectiveSaleItemPrice))
                totalRoyaltyCut = totalRoyaltyCut + royalty.cut * effectiveSaleItemPrice
            }
        }
        // Append the cut for the seller.
        self.saleCuts.append(${NFTStorefrontV2.name}.SaleCut(
            receiver: self.fiatReceiver,
            amount: effectiveSaleItemPrice - totalRoyaltyCut
        ))
        assert(self.%nftContract%Provider.borrow() != nil, message: "Missing or mis-typed %nftContract%.Collection provider")

        self.storefront = acct.borrow<&${NFTStorefrontV2.name}.Storefront>(from: ${NFTStorefrontV2.name}.StorefrontStoragePath)
            ?? panic("Missing or mis-typed NFTStorefront Storefront")

        for marketplace in marketplacesAddress {
            // Here we are making a fair assumption that all given addresses would have
            // the capability to receive the
            self.marketplacesCapability.append(getAccount(marketplace).getCapability<&{${FungibleToken.name}.Receiver}>(%ftPublicPath%))
        }
    }

    execute {
        // Create listing
        self.storefront.createListing(
            nftProviderCapability: self.%nftContract%Provider,
            nftType: Type<@%nftContract%.NFT>(),
            nftID: saleItemID,
            salePaymentVaultType: Type<@%ftContract%.Vault>(),
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
