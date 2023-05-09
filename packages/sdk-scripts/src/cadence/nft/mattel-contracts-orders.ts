import type {
	ContractDetails,
	ContractsAddresses, MattelCollection} from "./mattel-contracts"
import {
	BBxBarbieCard,
	BBxBarbiePack,
	FlowToken,
	FungibleToken,
	HWGarageCard, HWGarageCardV2,
	HWGaragePack, HWGaragePackV2,
	MetadataViews,
	NonFungibleToken, TypeOfContract,
} from "./mattel-contracts"

export const txInitNFTContracts: string = `
import ${NonFungibleToken.name} from "${NonFungibleToken.testnetAddressRaribleDeployed}"
import ${MetadataViews.name} from "${MetadataViews.testnetAddressRaribleDeployed}"
import ${FungibleToken.name} from "${FungibleToken.testnetAddressRaribleDeployed}"
import ${FlowToken.name} from "${FlowToken.testnetAddressRaribleDeployed}"
import ${HWGarageCard.name} from "${HWGarageCard.testnetAddressRaribleDeployed}"
import ${HWGaragePack.name} from "${HWGaragePack.testnetAddressRaribleDeployed}"

transaction() {
    prepare(acct: AuthAccount) {
        if acct.borrow<&${HWGarageCard.name}.${HWGarageCard.contractType}>(from: ${HWGarageCard.storagePath}) == nil {
            let collection <- ${HWGarageCard.name}.${HWGarageCard.nameOfMethodForCreateResource}
            acct.save(<-collection, to: ${HWGarageCard.storagePath})
        }
        if acct.getCapability<${HWGarageCard.publicType}>(${HWGarageCard.publicPath}).borrow() == nil {
            acct.link<${HWGarageCard.publicType}>(${HWGarageCard.publicPath}, target: ${HWGarageCard.storagePath})
        }

        if acct.borrow<&${HWGaragePack.name}.${HWGarageCard.contractType}>(from: ${HWGaragePack.storagePath}) == nil {
            let collection <- ${HWGaragePack.name}.${HWGaragePack.nameOfMethodForCreateResource}
            acct.save(<-collection, to: ${HWGaragePack.storagePath})
        }
        if acct.getCapability<${HWGaragePack.publicType}>(${HWGaragePack.publicPath}).borrow() == nil {
            acct.link<${HWGaragePack.publicType}>(${HWGaragePack.publicPath}, target: ${HWGaragePack.storagePath})
        }
    }
    execute {
    }
}`

const NFTStorefrontV2: ContractsAddresses & ContractDetails = {
	name: "NFTStorefrontV2",
	mainnetAddress: "0x4eb8a10cb9f87357",
	testnetAddress: "0x2d55b98eb200daef",
	testnetAddressRaribleDeployed: "0x80102bce1de42dc4",
	storagePath: "NFTStorefrontV2.StorefrontStoragePath",
	publicPath: "NFTStorefrontV2.StorefrontPublicPath",
	publicType: "&NFTStorefrontV2.Storefront{NFTStorefrontV2.StorefrontPublic}",
	contractType: TypeOfContract.STOREFRONT,
	nameOfMethodForCreateResource: "createStorefront() as! @NFTStorefrontV2.Storefront",
}

export const txInitStorefrontV2: string = `
import ${NFTStorefrontV2.name} from "${NFTStorefrontV2.testnetAddressRaribleDeployed}"

transaction() {
    prepare(acct: AuthAccount) {
        if acct.borrow<&${NFTStorefrontV2.name}.${NFTStorefrontV2.contractType}>(from: ${NFTStorefrontV2.storagePath}) == nil {
            let collection <- ${NFTStorefrontV2.name}.${NFTStorefrontV2.nameOfMethodForCreateResource}
            acct.save(<-collection, to: ${NFTStorefrontV2.storagePath})
        }
        if acct.getCapability<${NFTStorefrontV2.publicType}>(${NFTStorefrontV2.publicPath}).borrow() == nil {
            acct.link<${NFTStorefrontV2.publicType}>(${NFTStorefrontV2.publicPath}, target: ${NFTStorefrontV2.storagePath})
        }
    }
    execute {
    }
}`

const preparePartOfInit = `
			if acct.borrow<&${HWGarageCard.name}.${HWGarageCard.contractType}>(from: ${HWGarageCard.storagePath}) == nil {
					let collection <- ${HWGarageCard.name}.${HWGarageCard.nameOfMethodForCreateResource}
					acct.save(<-collection, to: ${HWGarageCard.storagePath})
			}
			if acct.getCapability<${HWGarageCard.publicType}>(${HWGarageCard.publicPath}).borrow() == nil {
					acct.link<${HWGarageCard.publicType}>(${HWGarageCard.publicPath}, target: ${HWGarageCard.storagePath})
			}

			if acct.borrow<&${HWGarageCardV2.name}.${HWGarageCardV2.contractType}>(from: ${HWGarageCardV2.storagePath}) == nil {
					let collection <- ${HWGarageCardV2.name}.${HWGarageCardV2.nameOfMethodForCreateResource}
					acct.save(<-collection, to: ${HWGarageCardV2.storagePath})
			}
			if acct.getCapability<${HWGarageCardV2.publicType}>(${HWGarageCardV2.publicPath}).borrow() == nil {
					acct.link<${HWGarageCardV2.publicType}>(${HWGarageCardV2.publicPath}, target: ${HWGarageCardV2.storagePath})
			}

			if acct.borrow<&${HWGaragePack.name}.${HWGarageCard.contractType}>(from: ${HWGaragePack.storagePath}) == nil {
					let collection <- ${HWGaragePack.name}.${HWGaragePack.nameOfMethodForCreateResource}
					acct.save(<-collection, to: ${HWGaragePack.storagePath})
			}
			if acct.getCapability<${HWGaragePack.publicType}>(${HWGaragePack.publicPath}).borrow() == nil {
					acct.link<${HWGaragePack.publicType}>(${HWGaragePack.publicPath}, target: ${HWGaragePack.storagePath})
			}

			if acct.borrow<&${HWGaragePackV2.name}.${HWGaragePackV2.contractType}>(from: ${HWGaragePackV2.storagePath}) == nil {
					let collection <- ${HWGaragePackV2.name}.${HWGaragePackV2.nameOfMethodForCreateResource}
					acct.save(<-collection, to: ${HWGaragePackV2.storagePath})
			}
			if acct.getCapability<${HWGaragePackV2.publicType}>(${HWGaragePackV2.publicPath}).borrow() == nil {
					acct.link<${HWGaragePackV2.publicType}>(${HWGaragePackV2.publicPath}, target: ${HWGaragePackV2.storagePath})
			}

      if acct.borrow<&BBxBarbieToken.Collection>(from: BBxBarbieToken.CollectionStoragePath) == nil {
          let collection <- BBxBarbieToken.createEmptyCollection()
          acct.save(<-collection, to: BBxBarbieToken.CollectionStoragePath)
      }
      if acct.getCapability<&BBxBarbieToken.Collection{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic, NonFungibleToken.Receiver, BBxBarbieToken.TokenCollectionPublic, MetadataViews.ResolverCollection}>(BBxBarbieToken.CollectionPublicPath).borrow() == nil {
          acct.link<&BBxBarbieToken.Collection{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic, NonFungibleToken.Receiver, BBxBarbieToken.TokenCollectionPublic, MetadataViews.ResolverCollection}>(BBxBarbieToken.CollectionPublicPath, target: BBxBarbieToken.CollectionStoragePath)
      }

			if acct.borrow<&${BBxBarbiePack.name}.${BBxBarbiePack.contractType}>(from: ${BBxBarbiePack.storagePath}) == nil {
					let collection <- ${BBxBarbiePack.name}.${BBxBarbiePack.nameOfMethodForCreateResource}
					acct.save(<-collection, to: ${BBxBarbiePack.storagePath})
			}
			if acct.getCapability<${BBxBarbiePack.publicType}>(${BBxBarbiePack.publicPath}).borrow() == nil {
					acct.link<${BBxBarbiePack.publicType}>(${BBxBarbiePack.publicPath}, target: ${BBxBarbiePack.storagePath})
			}

			if acct.borrow<&${BBxBarbieCard.name}.${BBxBarbieCard.contractType}>(from: ${BBxBarbieCard.storagePath}) == nil {
					let collection <- ${BBxBarbieCard.name}.${BBxBarbieCard.nameOfMethodForCreateResource}
					acct.save(<-collection, to: ${BBxBarbieCard.storagePath})
			}
			if acct.getCapability<${BBxBarbieCard.publicType}>(${BBxBarbieCard.publicPath}).borrow() == nil {
					acct.link<${BBxBarbieCard.publicType}>(${BBxBarbieCard.publicPath}, target: ${BBxBarbieCard.storagePath})
			}

			if acct.borrow<&${NFTStorefrontV2.name}.${NFTStorefrontV2.contractType}>(from: ${NFTStorefrontV2.storagePath}) == nil {
					let collection <- ${NFTStorefrontV2.name}.${NFTStorefrontV2.nameOfMethodForCreateResource}
					acct.save(<-collection, to: ${NFTStorefrontV2.storagePath})
			}
			if acct.getCapability<${NFTStorefrontV2.publicType}>(${NFTStorefrontV2.publicPath}).borrow() == nil {
					acct.link<${NFTStorefrontV2.publicType}>(${NFTStorefrontV2.publicPath}, target: ${NFTStorefrontV2.storagePath})
			}
`
export const txInitNFTContractsAndStorefrontV2: string = `
import NonFungibleToken from 0xNonFungibleToken
import MetadataViews from 0xMetadataViews
import FungibleToken from 0xFungibleToken
import FlowToken from 0xFlowToken
import ${HWGarageCard.name} from 0xHWGarageCard
import ${HWGaragePack.name} from 0xHWGaragePack
import HWGarageCardV2 from 0xHWGarageCardV2
import HWGaragePackV2 from 0xHWGaragePackV2
import BBxBarbiePack from 0xBBxBarbiePack
import BBxBarbieCard from 0xBBxBarbieCard
import NFTStorefrontV2 from 0xNFTStorefrontV2

transaction() {
    prepare(acct: AuthAccount) {
${preparePartOfInit}
    }
    execute {
    }
}`

export const alternativeTxInitStorefrontV2: string = `
import ${NFTStorefrontV2.name} from "${NFTStorefrontV2.testnetAddressRaribleDeployed}"

transaction {
    prepare(acct: AuthAccount) {
        if acct.borrow<&${NFTStorefrontV2.name}.${NFTStorefrontV2.contractType}>(from: ${NFTStorefrontV2.storagePath}) == nil {
            let collection <- ${NFTStorefrontV2.name}.${NFTStorefrontV2.nameOfMethodForCreateResource}
            acct.save(<-collection, to: ${NFTStorefrontV2.storagePath})
            acct.link<${NFTStorefrontV2.publicType}>(${NFTStorefrontV2.publicPath}, target: ${NFTStorefrontV2.storagePath})
        }
    }
}
`

export const getTxListItemStorefrontV2 = (collection: MattelCollection) => {
	let borrowMethod: string
	if (["HWGaragePack", "HWGaragePackV2", "BBxBarbiePack"].includes(collection)) {
		borrowMethod = "borrowPack"
	} else if (collection === "HWGarageCard") {
		borrowMethod = "borrowHWGarageCard"
	} else if (["HWGarageCardV2", "BBxBarbieCard"].includes(collection)) {
		borrowMethod = "borrowCard"
	} else {
		throw new Error(`Unrecognized collection name (${collection}), expected HWGaragePack | HWGarageCard`)
	}
	return `
import ${FlowToken.name} from 0xFlowToken
import ${FungibleToken.name} from 0xFungibleToken
import ${NonFungibleToken.name} from 0xNonFungibleToken
import ${MetadataViews.name} from 0xMetadataViews
import ${NFTStorefrontV2.name} from 0xNFTStorefrontV2
import ${HWGarageCard.name} from 0xHWGarageCard
import ${HWGaragePack.name} from 0xHWGaragePack
import HWGarageCardV2 from 0xHWGarageCardV2
import HWGaragePackV2 from 0xHWGaragePackV2
import BBxBarbiePack from 0xBBxBarbiePack
import BBxBarbieCard from 0xBBxBarbieCard
import BBxBarbieToken from 0xBBxBarbieToken

transaction(saleItemID: UInt64, saleItemPrice: UFix64, customID: String?, commissionAmount: UFix64, expiry: UInt64, marketplacesAddress: [Address]) {
    let fiatReceiver: Capability<&AnyResource{${FungibleToken.name}.Receiver}>
    let %nftContract%Provider: Capability<&AnyResource{${NonFungibleToken.name}.Provider, ${NonFungibleToken.name}.CollectionPublic}>
    let storefront: &${NFTStorefrontV2.name}.Storefront
    var saleCuts: [${NFTStorefrontV2.name}.SaleCut]
    var marketplacesCapability: [Capability<&AnyResource{${FungibleToken.name}.Receiver}>]

    prepare(acct: AuthAccount) {
${preparePartOfInit}

        self.saleCuts = []
        self.marketplacesCapability = []

        // We need a provider capability, but one is not provided by default so we create one if needed.
        let %nftContract%ProviderPrivatePath = %nftPrivatePath%

        // Receiver for the sale cut.
        self.fiatReceiver = acct.getCapability<&{${FungibleToken.name}.Receiver}>(/public/flowTokenReceiver)
        assert(self.fiatReceiver.borrow() != nil, message: "Missing or mis-typed FiatToken receiver")
//        self.flowReceiver = acct.getCapability<&{${FungibleToken.name}.Receiver}>(/public/flowTokenReceiver)
//        assert(self.flowReceiver.borrow() != nil, message: "Missing or mis-typed FlowToken receiver")

        // Check if the Provider capability exists or not if then create a new link for the same.
        if !acct.getCapability<&{${NonFungibleToken.name}.Provider, ${NonFungibleToken.name}.CollectionPublic}>(%nftContract%ProviderPrivatePath).check() {
            acct.link<&{${NonFungibleToken.name}.Provider, ${NonFungibleToken.name}.CollectionPublic}>(%nftContract%ProviderPrivatePath, target: %nftStoragePath%)
        }

        self.%nftContract%Provider = acct.getCapability<&{${NonFungibleToken.name}.Provider, ${NonFungibleToken.name}.CollectionPublic}>(%nftContract%ProviderPrivatePath)
        let collection = acct
            .getCapability(%nftContract%.CollectionPublicPath)
            .borrow<&{%nftPublicTypeMin%}>()
            ?? panic("Could not borrow a reference to the collection")
        var totalRoyaltyCut = 0.0
        let effectiveSaleItemPrice = saleItemPrice - commissionAmount
        // eslint-disable-next-line
        let nft = collection.${borrowMethod}(id: saleItemID)!
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
            self.marketplacesCapability.append(getAccount(marketplace).getCapability<&{${FungibleToken.name}.Receiver}>(/public/flowTokenReceiver))
        }
    }

    execute {
        // Create listing
        self.storefront.createListing(
            nftProviderCapability: self.%nftContract%Provider,
            nftType: Type<@%nftContract%.NFT>(),
            nftID: saleItemID,
            salePaymentVaultType: Type<@${FlowToken.name}.Vault>(),
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

export const txUnlistItemStorefrontV2: string = `
import NFTStorefrontV2 from 0xNFTStorefrontV2

transaction(listingResourceID: UInt64) {
    let storefront: &NFTStorefrontV2.Storefront{NFTStorefrontV2.StorefrontManager}

    prepare(acct: AuthAccount) {
        self.storefront = acct.borrow<&NFTStorefrontV2.Storefront{NFTStorefrontV2.StorefrontManager}>(from: NFTStorefrontV2.StorefrontStoragePath)
            ?? panic("Missing or mis-typed NFTStorefrontV2.Storefront")
    }

    execute {
        self.storefront.removeListing(listingResourceID: listingResourceID)
    }
}
`

export const getTxChangePriceStorefrontV2 = (collection: MattelCollection) => {
	let borrowMethod: string
	if (["HWGaragePack", "HWGaragePackV2", "BBxBarbiePack"].includes(collection)) {
		borrowMethod = "borrowPack"
	} else if (collection === "HWGarageCard") {
		borrowMethod = "borrowHWGarageCard"
	} else if (["HWGarageCardV2", "BBxBarbieCard"].includes(collection)) {
		borrowMethod = "borrowCard"
	} else {
		throw new Error(`Unrecognized collection name (${collection}), expected HWGaragePack | HWGarageCard`)
	}
	return `
import FlowToken from 0xFlowToken
import FungibleToken from 0xFungibleToken
import NonFungibleToken from 0xNonFungibleToken
import MetadataViews from 0xMetadataViews
import NFTStorefrontV2 from 0xNFTStorefrontV2
import ${HWGarageCard.name} from 0xHWGarageCard
import ${HWGaragePack.name} from 0xHWGaragePack
import HWGarageCardV2 from 0xHWGarageCardV2
import HWGaragePackV2 from 0xHWGaragePackV2
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
${preparePartOfInit}

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

export const txBuyItemStorefrontV2: string = `
import ${FlowToken.name} from 0xFlowToken
import ${FungibleToken.name} from 0xFungibleToken
import ${MetadataViews.name} from 0xMetadataViews
import ${NonFungibleToken.name} from 0xNonFungibleToken
import ${NFTStorefrontV2.name} from 0xNFTStorefrontV2
import ${HWGarageCard.name} from 0xHWGarageCard
import ${HWGaragePack.name} from 0xHWGaragePack
import HWGarageCardV2 from 0xHWGarageCardV2
import HWGaragePackV2 from 0xHWGaragePackV2
import BBxBarbiePack from 0xBBxBarbiePack
import BBxBarbieCard from 0xBBxBarbieCard
import BBxBarbieToken from 0xBBxBarbieToken

transaction(listingResourceID: UInt64, storefrontAddress: Address, commissionRecipient: Address?) {
    let paymentVault: @${FungibleToken.name}.Vault
    let %nftContract%Collection: &%nftContract%.Collection{${NonFungibleToken.name}.Receiver}
    let storefront: &${NFTStorefrontV2.name}.Storefront{${NFTStorefrontV2.name}.StorefrontPublic}
    let listing: &${NFTStorefrontV2.name}.Listing{${NFTStorefrontV2.name}.ListingPublic}
    var commissionRecipientCap: Capability<&{${FungibleToken.name}.Receiver}>?

    prepare(acct: AuthAccount) {
${preparePartOfInit}
        self.commissionRecipientCap = nil
        // self.commissionRecipientCap = getAccount(commissionRecipient!).getCapability<&{${FungibleToken.name}.Receiver}>(/public/flowTokenReceiver)
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
        let mainFlowVault = acct.borrow<&${FlowToken.name}.Vault>(from: /storage/flowTokenVault)
            ?? panic("Cannot borrow FlowToken vault from acct storage")
        self.paymentVault <- mainFlowVault.withdraw(amount: price)

        // Access the buyer's NFT collection to store the purchased NFT.
        self.%nftContract%Collection = acct.borrow<&%nftContract%.Collection{${NonFungibleToken.name}.Receiver}>(
            from: %nftContract%.CollectionStoragePath
        ) ?? panic("Cannot borrow buyers Pack collection receiver")

        // Fetch the commission amt.
        let commissionAmount = self.listing.getDetails().commissionAmount

        if commissionRecipient != nil && commissionAmount != 0.0 {
            // Access the capability to receive the commission.
            let _commissionRecipientCap = getAccount(commissionRecipient!).getCapability<&{${FungibleToken.name}.Receiver}>(/public/flowTokenReceiver)
            assert(_commissionRecipientCap.check(), message: "Commission Recipient doesn't have FiatToken receiving capability")
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

export const scriptOrderDetails = `
import NFTStorefrontV2 from address

// This script returns the details for a listing within a storefront

pub fun main(storefrontAddress: Address, listingResourceID: UInt64): NFTStorefrontV2.ListingDetails {
		let storefront = getAccount(storefrontAddress)
			.getCapability<&NFTStorefrontV2.Storefront{NFTStorefrontV2.StorefrontPublic}>(
					NFTStorefrontV2.StorefrontPublicPath
			)
			.borrow()
			?? panic("Could not borrow Storefront from provided address")

		// Borrow the listing
		let listing = storefront.borrowListing(listingResourceID: listingResourceID)
								?? panic("No Offer with that ID in Storefront")
		return listing.getDetails()
}
`
