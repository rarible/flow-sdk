export const transferGarageCardV2 = `
import NonFungibleToken from 0xNonFungibleToken
import MetadataViews from 0xMetadataViews
import HWGarageCardV2 from 0xHWGarageCardV2

transaction(
    cardEditionID: UInt64
    , to: Address
    ) {

    prepare(acct: auth(BorrowValue, IssueStorageCapabilityController, PublishCapability, SaveValue, UnpublishCapability) &Account) {
        // Setup Card Collection
        let cardCollectionData: MetadataViews.NFTCollectionData = HWGarageCardV2.resolveContractView(resourceType: nil, viewType: Type<MetadataViews.NFTCollectionData>()) as! MetadataViews.NFTCollectionData?
            ?? panic("ViewResolver does not resolve NFTCollectionData view")

        // exit if cardCollection exists
        if acct.storage.borrow<&HWGarageCardV2.Collection>(from: cardCollectionData.storagePath) == nil {
            // create a new empty cardCollection for HWGarageCardV2
            let cardCollection: @{NonFungibleToken.Collection} <- HWGarageCardV2.createEmptyCollection(nftType: Type<@HWGarageCardV2.NFT>())

            // save HWGarageCardV2 cardCollection to the account
            acct.storage.save(<-cardCollection, to: cardCollectionData.storagePath)

            // create a public capability for the HWGarageCardV2 cardCollection
            acct.capabilities.unpublish(cardCollectionData.publicPath) // remove any current pubCap
            let cardCollectionCap: Capability<&HWGarageCardV2.Collection> = acct.capabilities.storage.issue<&HWGarageCardV2.Collection>(cardCollectionData.storagePath)
            acct.capabilities.publish(cardCollectionCap, at: cardCollectionData.publicPath)
        }

        let cardToTransfer: @HWGarageCardV2.NFT <-acct.storage.borrow<auth(NonFungibleToken.Withdraw) &{NonFungibleToken.Provider}>(from: HWGarageCardV2.CollectionStoragePath)!.withdraw(withdrawID: cardEditionID) as! @HWGarageCardV2.NFT
        HWGarageCardV2.transfer(uuid: cardToTransfer.uuid, id: cardToTransfer.id, packSeriesId: cardToTransfer.packSeriesID, cardEditionId: cardToTransfer.id,  toAddress: to)
        getAccount(to).capabilities.get<&{NonFungibleToken.Receiver}>(HWGarageCardV2.CollectionPublicPath).borrow()!.deposit(token: <-cardToTransfer)

    }
    execute {
    }
}

`

export const transferGaragePackV2 = `
import NonFungibleToken from 0xNonFungibleToken
import MetadataViews from 0xMetadataViews
import HWGaragePackV2 from 0xHWGaragePackV2

transaction(
    packEditionID: UInt64
    , to: Address
    ) {

    prepare(acct: AuthAccount) {
        // Setup card collection if they aren't already setup
        if acct.borrow<&HWGaragePackV2.Collection>(from: HWGaragePackV2.CollectionStoragePath) == nil {
            let collection <- HWGaragePackV2.createEmptyCollection()
            acct.save(<-collection, to: HWGaragePackV2.CollectionStoragePath)
        }
        if acct.getCapability<&HWGaragePackV2.Collection{NonFungibleToken.CollectionPublic, NonFungibleToken.Receiver, HWGaragePackV2.PackCollectionPublic, MetadataViews.ResolverCollection}>(HWGaragePackV2.CollectionPublicPath).borrow() == nil {
            acct.link<&HWGaragePackV2.Collection{NonFungibleToken.CollectionPublic, NonFungibleToken.Receiver, HWGaragePackV2.PackCollectionPublic, MetadataViews.ResolverCollection}>(HWGaragePackV2.CollectionPublicPath, target: HWGaragePackV2.CollectionStoragePath)
        }

        let packToTransfer <-acct.borrow<&{NonFungibleToken.Provider}>(from: HWGaragePackV2.CollectionStoragePath)!.withdraw(withdrawID: packEditionID) as! @HWGaragePackV2.NFT
        let packToTransferRef: &HWGaragePackV2.NFT = &packToTransfer as! &HWGaragePackV2.NFT
        getAccount(to).getCapability<&{NonFungibleToken.Receiver}>(HWGaragePackV2.CollectionPublicPath).borrow()!.deposit(token: <-packToTransfer)
        HWGaragePackV2.transfer(uuid: packToTransferRef.uuid, id: packToTransferRef.id, packSeriesId: packToTransferRef.packSeriesID, packEditionId: packToTransferRef.packEditionID,  toAddress: to)

    }
    execute {
    }
}

`

export const transferGarageTokenV2 = `
import NonFungibleToken from 0xNonFungibleToken
import MetadataViews from 0xMetadataViews
import HWGarageTokenV2 from 0xHWGarageTokenV2

transaction(
    tokenEditionID: UInt64
    , to: Address
    ) {

    prepare(acct: AuthAccount) {
        // Setup card collection if they aren't already setup
        if acct.borrow<&HWGarageTokenV2.Collection>(from: HWGarageTokenV2.CollectionStoragePath) == nil {
            let collection <- HWGarageTokenV2.createEmptyCollection()
            acct.save(<-collection, to: HWGarageTokenV2.CollectionStoragePath)
        }
        if acct.getCapability<&HWGarageTokenV2.Collection{NonFungibleToken.CollectionPublic, NonFungibleToken.Receiver, HWGarageTokenV2.TokenCollectionPublic, MetadataViews.ResolverCollection}>(HWGarageTokenV2.CollectionPublicPath).borrow() == nil {
            acct.link<&HWGarageTokenV2.Collection{NonFungibleToken.CollectionPublic, NonFungibleToken.Receiver, HWGarageTokenV2.TokenCollectionPublic, MetadataViews.ResolverCollection}>(HWGarageTokenV2.CollectionPublicPath, target: HWGarageTokenV2.CollectionStoragePath)
        }

        let tokenToTransfer <-acct.borrow<&{NonFungibleToken.Provider}>(from: HWGarageTokenV2.CollectionStoragePath)!.withdraw(withdrawID: tokenEditionID) as! @HWGarageTokenV2.NFT
        let packToTransferRef: &HWGarageTokenV2.NFT = &tokenToTransfer as! &HWGarageTokenV2.NFT
        getAccount(to).getCapability<&{NonFungibleToken.Receiver}>(HWGarageTokenV2.CollectionPublicPath).borrow()!.deposit(token: <-tokenToTransfer)
        HWGarageTokenV2.transfer(uuid: packToTransferRef.uuid, id: packToTransferRef.id, packSeriesId: packToTransferRef.packSeriesID, tokenEditionId: packToTransferRef.tokenEditionID,  toAddress: to)

    }
    execute {
    }
}

`
