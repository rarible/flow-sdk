export const hwV1CardTransfer = `
import NonFungibleToken from 0xNonFungibleToken
import MetadataViews from 0xMetadataViews
import HWGarageCard from 0xHWGarageCard

transaction(
    cardEditionID: UInt64
    , to: Address
    ) {

    prepare(acct: auth(BorrowValue, IssueStorageCapabilityController, PublishCapability, SaveValue, UnpublishCapability) &Account) {
        // Setup Card Collection
        let cardCollectionData: MetadataViews.NFTCollectionData = HWGarageCard.resolveContractView(resourceType: nil, viewType: Type<MetadataViews.NFTCollectionData>()) as! MetadataViews.NFTCollectionData?
            ?? panic("ViewResolver does not resolve NFTCollectionData view")

        // exit if cardCollection exists
        if acct.storage.borrow<&HWGarageCard.Collection>(from: cardCollectionData.storagePath) == nil {
            // create a new empty cardCollection for HWGarageCard
            let cardCollection: @{NonFungibleToken.Collection} <- HWGarageCard.createEmptyCollection(nftType: Type<@HWGarageCard.NFT>())

            // save HWGarageCard cardCollection to the account
            acct.storage.save(<-cardCollection, to: cardCollectionData.storagePath)

            // create a public capability for the HWGarageCard cardCollection
            acct.capabilities.unpublish(cardCollectionData.publicPath) // remove any current pubCap
            let cardCollectionCap: Capability<&HWGarageCard.Collection> = acct.capabilities.storage.issue<&HWGarageCard.Collection>(cardCollectionData.storagePath)
            acct.capabilities.publish(cardCollectionCap, at: cardCollectionData.publicPath)
        }

        let cardToTransfer: @HWGarageCard.NFT <-acct.storage.borrow<auth(NonFungibleToken.Withdraw) &{NonFungibleToken.Provider}>(from: HWGarageCard.CollectionStoragePath)!.withdraw(withdrawID: cardEditionID) as! @HWGarageCard.NFT
        HWGarageCard.transfer(uuid: cardToTransfer.uuid, id: cardToTransfer.id, packSeriesId: 4, cardEditionId: cardToTransfer.id,  toAddress: to)
        getAccount(to).capabilities.get<&{NonFungibleToken.Receiver}>(HWGarageCard.CollectionPublicPath).borrow()!.deposit(token: <-cardToTransfer)

    }
    execute {
    }
}
`
