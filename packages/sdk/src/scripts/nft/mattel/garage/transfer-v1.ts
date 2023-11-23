export const transferGarageCardV1 = `
import NonFungibleToken from 0xNonFungibleToken
import MetadataViews from 0xMetadataViews
import HWGarageCard from 0xHWGarageCard

transaction(
    cardEditionID: UInt64
    , to: Address
    ) {

    prepare(acct: AuthAccount) {
        // Setup card collection if they aren't already setup
        if acct.borrow<&HWGarageCard.Collection>(from: HWGarageCard.CollectionStoragePath) == nil {
            let collection <- HWGarageCard.createEmptyCollection()
            acct.save(<-collection, to: HWGarageCard.CollectionStoragePath)
        }
        if acct.getCapability<&HWGarageCard.Collection{NonFungibleToken.CollectionPublic, NonFungibleToken.Receiver, HWGarageCard.HWGarageCardCollectionPublic, MetadataViews.ResolverCollection}>(HWGarageCard.CollectionPublicPath).borrow() == nil {
            acct.link<&HWGarageCard.Collection{NonFungibleToken.CollectionPublic, NonFungibleToken.Receiver, HWGarageCard.HWGarageCardCollectionPublic, MetadataViews.ResolverCollection}>(HWGarageCard.CollectionPublicPath, target: HWGarageCard.CollectionStoragePath)
        }

        let cardToTransfer <-acct.borrow<&{NonFungibleToken.Provider}>(from: HWGarageCard.CollectionStoragePath)!.withdraw(withdrawID: cardEditionID) as! @HWGarageCard.NFT
        let cardToTransferRef: &HWGarageCard.NFT = &cardToTransfer as! &HWGarageCard.NFT
        getAccount(to).getCapability<&{NonFungibleToken.Receiver}>(HWGarageCard.CollectionPublicPath).borrow()!.deposit(token: <-cardToTransfer)
        HWGarageCard.transfer(uuid: cardToTransferRef.uuid, id: cardToTransferRef.id, packSeriesId: 4, cardEditionId: cardToTransferRef.id,  toAddress: to)

    }
    execute {
    }
}

`

export const transferGaragePackV1 = `
import NonFungibleToken from 0xNonFungibleToken
import MetadataViews from 0xMetadataViews
import HWGaragePack from 0xHWGaragePack

transaction(
    packEditionID: UInt64
    , to: Address
    ) {

    prepare(acct: AuthAccount) {
        // Setup card collection if they aren't already setup
        if acct.borrow<&HWGaragePack.Collection>(from: HWGaragePack.CollectionStoragePath) == nil {
            let collection: @NonFungibleToken.Collection <- HWGaragePack.createEmptyCollection()
            acct.save(<-collection, to: HWGaragePack.CollectionStoragePath)
        }
        if acct.getCapability<&HWGaragePack.Collection{NonFungibleToken.CollectionPublic, NonFungibleToken.Receiver, HWGaragePack.PackCollectionPublic, MetadataViews.ResolverCollection}>(HWGaragePack.CollectionPublicPath).borrow() == nil {
            acct.link<&HWGaragePack.Collection{NonFungibleToken.CollectionPublic, NonFungibleToken.Receiver, HWGaragePack.PackCollectionPublic, MetadataViews.ResolverCollection}>(HWGaragePack.CollectionPublicPath, target: HWGaragePack.CollectionStoragePath)
        }

        let packToTransfer: @HWGaragePack.NFT <-acct.borrow<&{NonFungibleToken.Provider}>(from: HWGaragePack.CollectionStoragePath)!.withdraw(withdrawID: packEditionID) as! @HWGaragePack.NFT
        let packToTransferRef: &HWGaragePack.NFT = &packToTransfer as! &HWGaragePack.NFT
        getAccount(to).getCapability<&{NonFungibleToken.Receiver}>(HWGaragePack.CollectionPublicPath).borrow()!.deposit(token: <-packToTransfer)
        HWGaragePack.transfer(uuid: packToTransferRef.uuid, id: packToTransferRef.id, packSeriesId: packToTransferRef.packID, packEditionId: packToTransferRef.packEditionID,  toAddress: to)

    }
    execute {
    }
}

`
