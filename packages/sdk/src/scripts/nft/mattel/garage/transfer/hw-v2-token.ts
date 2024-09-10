export const hwV2TokenTransfer = `
import "NonFungibleToken" from 0xNonFungibleToken
import "MetadataViews" from 0xMetadataViews
import "HWGarageTokenV2" from 0xHWGarageTokenV2
import "HWGaragePMV2" from 0xHWGaragePMV2

transaction(
    cardEditionID: UInt64
    , to: Address
    ) {

    prepare(acct: auth(BorrowValue, IssueStorageCapabilityController, PublishCapability, SaveValue, UnpublishCapability) &Account) {
        // Setup Token Collection
        let tokenCollectionData: MetadataViews.NFTCollectionData = HWGarageTokenV2.resolveContractView(resourceType: nil, viewType: Type<MetadataViews.NFTCollectionData>()) as! MetadataViews.NFTCollectionData?
            ?? panic("ViewResolver does not resolve NFTCollectionData view")

        // exit if tokenCollection exists
        if acct.storage.borrow<&HWGarageTokenV2.Collection>(from: tokenCollectionData.storagePath) == nil {
            // create a new empty tokenCollection for HWGarageTokenV2
            let tokenCollection: @{NonFungibleToken.Collection} <- HWGarageTokenV2.createEmptyCollection(nftType: Type<@HWGarageTokenV2.NFT>())

            // save HWGarageTokenV2 tokenCollection to the account
            acct.storage.save(<-tokenCollection, to: tokenCollectionData.storagePath)

            // create a public capability for the HWGarageTokenV2 tokenCollection
            acct.capabilities.unpublish(tokenCollectionData.publicPath) // remove any current pubCap
            let tokenCollectionCap: Capability<&HWGarageTokenV2.Collection> = acct.capabilities.storage.issue<&HWGarageTokenV2.Collection>(tokenCollectionData.storagePath)
            acct.capabilities.publish(tokenCollectionCap, at: tokenCollectionData.publicPath)
        }

        let tokenToTransfer: @HWGarageTokenV2.NFT <-acct.storage.borrow<auth(NonFungibleToken.Withdraw) &{NonFungibleToken.Provider}>(from: HWGarageTokenV2.CollectionStoragePath)!.withdraw(withdrawID: cardEditionID) as! @HWGarageTokenV2.NFT
        HWGarageTokenV2.transfer(uuid: tokenToTransfer.uuid, id: tokenToTransfer.id, packSeriesId: tokenToTransfer.packSeriesID, tokenEditionId: tokenToTransfer.tokenEditionID,  toAddress: to)
        getAccount(to).capabilities.get<&{NonFungibleToken.Receiver}>(HWGarageTokenV2.CollectionPublicPath).borrow()!.deposit(token: <-tokenToTransfer)

    }
    execute {
    }
}

`
