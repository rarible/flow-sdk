
export const getTransferCode = (collection: string) => `
import NonFungibleToken from 0xNonFungibleToken
import MetadataViews from 0xMetadataViews
import ${collection} from 0x${collection}

transaction(
    cardEditionID: UInt64
    , to: Address
    ) {

    prepare(acct: auth(BorrowValue, IssueStorageCapabilityController, PublishCapability, SaveValue, UnpublishCapability) &Account) {
        // Setup Card Collection
        let cardCollectionData: MetadataViews.NFTCollectionData = ${collection}.resolveContractView(resourceType: nil, viewType: Type<MetadataViews.NFTCollectionData>()) as! MetadataViews.NFTCollectionData?
            ?? panic("ViewResolver does not resolve NFTCollectionData view")

        // exit if cardCollection exists
        if acct.storage.borrow<&${collection}.Collection>(from: cardCollectionData.storagePath) == nil {
            // create a new empty cardCollection for ${collection}
            let cardCollection: @{NonFungibleToken.Collection} <- ${collection}.createEmptyCollection(nftType: Type<@${collection}.NFT>())

            // save ${collection} cardCollection to the account
            acct.storage.save(<-cardCollection, to: cardCollectionData.storagePath)

            // create a public capability for the ${collection} cardCollection
            acct.capabilities.unpublish(cardCollectionData.publicPath) // remove any current pubCap
            let cardCollectionCap: Capability<&${collection}.Collection> = acct.capabilities.storage.issue<&${collection}.Collection>(cardCollectionData.storagePath)
            acct.capabilities.publish(cardCollectionCap, at: cardCollectionData.publicPath)
        }

        let cardToTransfer: @${collection}.NFT <-acct.storage.borrow<auth(NonFungibleToken.Withdraw) &{NonFungibleToken.Provider}>(from: ${collection}.CollectionStoragePath)!.withdraw(withdrawID: cardEditionID) as! @${collection}.NFT
        ${collection}.transfer(uuid: cardToTransfer.uuid, id: cardToTransfer.id, packSeriesId: cardToTransfer.packSeriesID, cardEditionId: cardToTransfer.id,  toAddress: to)
        getAccount(to).capabilities.get<&{NonFungibleToken.Receiver}>(${collection}.CollectionPublicPath).borrow()!.deposit(token: <-cardToTransfer)

    }
    execute {
    }
}

`
