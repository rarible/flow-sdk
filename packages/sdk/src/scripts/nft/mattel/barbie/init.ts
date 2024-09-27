export const barbieRawInitPart = `
// Setup Token Collection

   let barbieTokenCollectionData: MetadataViews.NFTCollectionData = BBxBarbieToken.resolveContractView(resourceType: nil, viewType: Type<MetadataViews.NFTCollectionData>()) as! MetadataViews.NFTCollectionData?
     ?? panic("ViewResolver does not resolve NFTCollectionData view")

   // exit if tokenCollection exists
   if acct.storage.borrow<&BBxBarbieToken.Collection>(from: barbieTokenCollectionData.storagePath) == nil {
     // create a new empty tokenCollection for BBxBarbieToken
     let tokenCollection: @{NonFungibleToken.Collection} <- BBxBarbieToken.createEmptyCollection(nftType: Type<@BBxBarbieToken.NFT>())

     // save BBxBarbieToken tokenCollection to the account
     acct.storage.save(<-tokenCollection, to: barbieTokenCollectionData.storagePath)

     // create a public capability for the BBxBarbieToken tokenCollection
     acct.capabilities.unpublish(barbieTokenCollectionData.publicPath) // remove any current pubCap
     let tokenCollectionCap: Capability<&BBxBarbieToken.Collection> = acct.capabilities.storage.issue<&BBxBarbieToken.Collection>(barbieTokenCollectionData.storagePath)
     acct.capabilities.publish(tokenCollectionCap, at: barbieTokenCollectionData.publicPath)
   }



   // Setup Card Collection

   let barbieCardCollectionData: MetadataViews.NFTCollectionData = BBxBarbieCard.resolveContractView(resourceType: nil, viewType: Type<MetadataViews.NFTCollectionData>()) as! MetadataViews.NFTCollectionData?
     ?? panic("ViewResolver does not resolve NFTCollectionData view")

   // exit if cardCollection exists
   if acct.storage.borrow<&BBxBarbieCard.Collection>(from: barbieCardCollectionData.storagePath) == nil {
     // create a new empty cardCollection for BBxBarbieCard
     let cardCollection: @{NonFungibleToken.Collection} <- BBxBarbieCard.createEmptyCollection(nftType: Type<@BBxBarbieCard.NFT>())

     // save BBxBarbieCard cardCollection to the account
     acct.storage.save(<-cardCollection, to: barbieCardCollectionData.storagePath)

     // create a public capability for the BBxBarbieCard cardCollection
     acct.capabilities.unpublish(barbieCardCollectionData.publicPath) // remove any current pubCap
     let cardCollectionCap: Capability<&BBxBarbieCard.Collection> = acct.capabilities.storage.issue<&BBxBarbieCard.Collection>(barbieCardCollectionData.storagePath)
     acct.capabilities.publish(cardCollectionCap, at: barbieCardCollectionData.publicPath)
   }
   // Setup Pack Collection

   let barbiePackCollectionData: MetadataViews.NFTCollectionData = BBxBarbiePack.resolveContractView(resourceType: nil, viewType: Type<MetadataViews.NFTCollectionData>()) as! MetadataViews.NFTCollectionData?
     ?? panic("ViewResolver does not resolve NFTCollectionData view")

   // exit if packCollection exists
   if acct.storage.borrow<&BBxBarbiePack.Collection>(from: barbiePackCollectionData.storagePath) == nil {
     // create a new empty packCollection for BBxBarbiePack
     let packCollection: @{NonFungibleToken.Collection} <- BBxBarbiePack.createEmptyCollection(nftType: Type<@BBxBarbiePack.NFT>())

     // save BBxBarbiePack packCollection to the account
     acct.storage.save(<-packCollection, to: barbiePackCollectionData.storagePath)

     // create a public capability for the BBxBarbiePack packCollection
     acct.capabilities.unpublish(barbiePackCollectionData.publicPath) // remove any current pubCap
     let packCollectionCap: Capability<&BBxBarbiePack.Collection> = acct.capabilities.storage.issue<&BBxBarbiePack.Collection>(barbiePackCollectionData.storagePath)
     acct.capabilities.publish(packCollectionCap, at: barbiePackCollectionData.publicPath)
   }
`
export const barbiePreparePartOfInit = `
${barbieRawInitPart}

		if acct.storage.borrow<&NFTStorefrontV2.Storefront>(from: NFTStorefrontV2.StorefrontStoragePath) == nil {
    // Create a new empty Storefront
    let storefront: @NFTStorefrontV2.Storefront <- NFTStorefrontV2.createStorefront()

    // save it to the account
    acct.storage.save(<-storefront, to: NFTStorefrontV2.StorefrontStoragePath)

    // create a public capability for the Storefront
    let storefrontPublicCap: Capability<&{NFTStorefrontV2.StorefrontPublic}> = acct.capabilities.storage.issue<&{NFTStorefrontV2.StorefrontPublic}>(
        NFTStorefrontV2.StorefrontStoragePath
      )
    acct.capabilities.publish(storefrontPublicCap, at: NFTStorefrontV2.StorefrontPublicPath)
      }
`

export const barbieImports = `
import BBxBarbiePack from 0xBBxBarbiePack
import BBxBarbieCard from 0xBBxBarbieCard
import BBxBarbieToken from 0xBBxBarbieToken
`
