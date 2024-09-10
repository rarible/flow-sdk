export const hwV2CardTransfer = `
import "NonFungibleToken"
import "MetadataViews"
import "HWGarageCardV2"
import "HWGaragePMV2"

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
        HWGarageCardV2.transfer(uuid: cardToTransfer.uuid, id: cardToTransfer.id, packSeriesId: cardToTransfer.packSeriesID, cardEditionId: cardToTransfer.cardEditionID,  toAddress: to)
        getAccount(to).capabilities.get<&{NonFungibleToken.Receiver}>(HWGarageCardV2.CollectionPublicPath).borrow()!.deposit(token: <-cardToTransfer)

    }
    execute {
    }
}
`
