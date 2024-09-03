import {
	FungibleToken,
	HWGarageCard, HWGaragePack,
	MetadataViews,
	NFTStorefrontV2,
	NonFungibleToken,
} from "../../contracts"
import {storefrontInit} from "../../storefront-init"
import {garagePreparePartOfInit} from "./init"

export const garageBuyTxCode: string = `
import %ftContract% from 0x%ftContract%
import ${FungibleToken.name} from 0xFungibleToken
import ${MetadataViews.name} from 0xMetadataViews
import ${NonFungibleToken.name} from 0xNonFungibleToken
import ${NFTStorefrontV2.name} from 0xNFTStorefrontV2
import ${HWGarageCard.name} from 0xHWGarageCard
import ${HWGaragePack.name} from 0xHWGaragePack
import HWGarageCardV2 from 0xHWGarageCardV2
import HWGaragePackV2 from 0xHWGaragePackV2
import HWGarageTokenV2 from 0xHWGarageTokenV2

transaction(listingResourceID: UInt64, storefrontAddress: Address, commissionRecipient: Address?) {
    let paymentVault: @{${FungibleToken.name}.Vault}
    let %nftContract%Collection: &{NonFungibleToken.Receiver}
    let storefront: &{NFTStorefrontV2.StorefrontPublic}
    let listing: &{NFTStorefrontV2.ListingPublic}
    var commissionRecipientCap: Capability<&{${FungibleToken.name}.Receiver}>?

    prepare(acct: auth(BorrowValue, IssueStorageCapabilityController, PublishCapability, SaveValue, UnpublishCapability, Storage) &Account) {
${garagePreparePartOfInit}
${storefrontInit}
        self.commissionRecipientCap = nil
        self.storefront = getAccount(storefrontAddress).capabilities.borrow<&{NFTStorefrontV2.StorefrontPublic}>(
                NFTStorefrontV2.StorefrontPublicPath
            ) ?? panic("Could not borrow Storefront from provided address")

        // Borrow the listing
        self.listing = self.storefront.borrowListing(listingResourceID: listingResourceID)
                    ?? panic("No Offer with that ID in Storefront")
        let price = self.listing.getDetails().salePrice

        let mainFlowVault = acct.storage.borrow<auth(FungibleToken.Withdraw) &%ftContract%.Vault>(from: %ftStoragePath%)
            ?? panic("Cannot borrow FlowToken vault from acct storage")
        // Access the vault of the buyer to pay the sale price of the listing.
        self.paymentVault <- mainFlowVault.withdraw(amount: price)

        let collectionData = %nftContract%.resolveContractView(resourceType: nil, viewType: Type<MetadataViews.NFTCollectionData>()) as! MetadataViews.NFTCollectionData?
            ?? panic("ViewResolver does not resolve NFTCollectionData view")

        // Access the buyer's NFT collection to store the purchased NFT.
        self.%nftContract%Collection = acct.capabilities.borrow<&{NonFungibleToken.Receiver}>(collectionData.publicPath)
            ?? panic("Cannot borrow buyers Pack collection receiver")

        // Fetch the commission amt.
        let commissionAmount = self.listing.getDetails().commissionAmount

        if commissionRecipient != nil && commissionAmount != 0.0 {
            let _commissionRecipientCap = getAccount(commissionRecipient!).capabilities.get<&{FungibleToken.Receiver}>(
               %ftPublicPath%
            )
            // Access the capability to receive the commission.
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
