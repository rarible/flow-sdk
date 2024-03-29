import {
	FungibleToken,
	MetadataViews,
	NFTStorefrontV2,
	NonFungibleToken,
} from "../contracts"
import {gamisodesRawInitPart} from "./init"

export const gamisodesBuyTxCode: string = `
import %ftContract% from 0x%ftContract%
import ${FungibleToken.name} from 0xFungibleToken
import ${MetadataViews.name} from 0xMetadataViews
import ${NonFungibleToken.name} from 0xNonFungibleToken
import ${NFTStorefrontV2.name} from 0xNFTStorefrontV2
import TokenForwarding from 0xTokenForwarding
import Gamisodes from 0xGamisodes
import NiftoryNFTRegistry from 0xNiftoryNFTRegistry
import NiftoryNonFungibleToken from 0xNiftoryNonFungibleToken

transaction(listingResourceID: UInt64, storefrontAddress: Address, commissionRecipient: Address?) {
    let paymentVault: @${FungibleToken.name}.Vault
    let %nftContract%Collection: &%nftContract%.Collection{${NonFungibleToken.name}.Receiver}
    let storefront: &${NFTStorefrontV2.name}.Storefront{${NFTStorefrontV2.name}.StorefrontPublic}
    let listing: &${NFTStorefrontV2.name}.Listing{${NFTStorefrontV2.name}.ListingPublic}
    var commissionRecipientCap: Capability<&{${FungibleToken.name}.Receiver}>?

    prepare(acct: AuthAccount) {
${gamisodesRawInitPart}
        self.commissionRecipientCap = nil
        // Access the storefront public resource of the seller to purchase the listing.
        self.storefront = getAccount(storefrontAddress)
            .getCapability<&${NFTStorefrontV2.name}.Storefront{${NFTStorefrontV2.name}.StorefrontPublic}>(
                ${NFTStorefrontV2.name}.StorefrontPublicPath
            )
            .borrow()
            ?? panic("Could not borrow Storefront from provided address")

        // Borrow the listing
        self.listing = self.storefront.borrowListing(listingResourceID: listingResourceID)
                    ?? panic("No Offer with that ID in Storefront")
        let price = self.listing.getDetails().salePrice

        // Access the vault of the buyer to pay the sale price of the listing.
        let mainFlowVault = acct.borrow<&%ftContract%.Vault>(from: %ftStoragePath%)
            ?? panic("Cannot borrow FlowToken vault from acct storage")
        self.paymentVault <- mainFlowVault.withdraw(amount: price)

        // Access the buyer's NFT collection to store the purchased NFT.
        self.%nftContract%Collection = acct.borrow<&%nftContract%.Collection{${NonFungibleToken.name}.Receiver}>(
            from: %nftStoragePath%
        ) ?? panic("Cannot borrow buyers Pack collection receiver")

        // Fetch the commission amt.
        let commissionAmount = self.listing.getDetails().commissionAmount

        if commissionRecipient != nil && commissionAmount != 0.0 {
            // Access the capability to receive the commission.
            let _commissionRecipientCap = getAccount(commissionRecipient!).getCapability<&{${FungibleToken.name}.Receiver}>(%ftPublicPath%)
            assert(_commissionRecipientCap.check(), message: "Commission Recipient doesn't have FT receiving capability")
            self.commissionRecipientCap = _commissionRecipientCap
        } else if commissionAmount == 0.0 {
            self.commissionRecipientCap = nil
        } else {
            panic("Commission recipient can not be empty when commission amount is non zero")
        }
    }

    execute {
        // Purchase the NFT
        let item <- self.listing.purchase(
            payment: <-self.paymentVault,
            commissionRecipient: self.commissionRecipientCap
        )
        // Deposit the NFT in the buyer's collection.
        self.%nftContract%Collection.deposit(token: <-item)
    }
}
`
