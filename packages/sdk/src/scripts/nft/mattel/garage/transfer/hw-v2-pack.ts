export const hwV2PackTransfer = `
import NonFungibleToken from 0xNonFungibleToken
import MetadataViews from 0xMetadataViews
import HWGaragePackV2 from 0xHWGaragePackV2

transaction(
    cardEditionID: UInt64
    , to: Address
    ) {

    prepare(acct: auth(BorrowValue, IssueStorageCapabilityController, PublishCapability, SaveValue, UnpublishCapability) &Account) {
        // Setup Pack Collection
        let packCollectionData: MetadataViews.NFTCollectionData = HWGaragePackV2.resolveContractView(resourceType: nil, viewType: Type<MetadataViews.NFTCollectionData>()) as! MetadataViews.NFTCollectionData?
            ?? panic("ViewResolver does not resolve NFTCollectionData view")

        // exit if packCollection exists
        if acct.storage.borrow<&HWGaragePackV2.Collection>(from: packCollectionData.storagePath) == nil {
            // create a new empty packCollection for HWGaragePackV2
            let packCollection: @{NonFungibleToken.Collection} <- HWGaragePackV2.createEmptyCollection(nftType: Type<@HWGaragePackV2.NFT>())

            // save HWGaragePackV2 packCollection to the account
            acct.storage.save(<-packCollection, to: packCollectionData.storagePath)

            // create a public capability for the HWGaragePackV2 packCollection
            acct.capabilities.unpublish(packCollectionData.publicPath) // remove any current pubCap
            let packCollectionCap: Capability<&HWGaragePackV2.Collection> = acct.capabilities.storage.issue<&HWGaragePackV2.Collection>(packCollectionData.storagePath)
            acct.capabilities.publish(packCollectionCap, at: packCollectionData.publicPath)
        }

        let packToTransfer: @HWGaragePackV2.NFT <-acct.storage.borrow<auth(NonFungibleToken.Withdraw) &{NonFungibleToken.Provider}>(from: HWGaragePackV2.CollectionStoragePath)!.withdraw(withdrawID: cardEditionID) as! @HWGaragePackV2.NFT
        HWGaragePackV2.transfer(uuid: packToTransfer.uuid, id: packToTransfer.id, packSeriesId: packToTransfer.packSeriesID, packEditionId: packToTransfer.packEditionID,  toAddress: to)
        getAccount(to).capabilities.get<&{NonFungibleToken.Receiver}>(HWGaragePackV2.CollectionPublicPath).borrow()!.deposit(token: <-packToTransfer)

    }
    execute {
    }
}
`
