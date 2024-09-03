import {HWGarageCard, HWGarageCardV2, HWGaragePack, HWGaragePackV2, HWGarageTokenV2, NFTStorefrontV2} from "../../contracts"

export const garageRawInitPart = `
        // HWGaragePack
   let packCollectionData: MetadataViews.NFTCollectionData = HWGaragePack.resolveContractView(resourceType: nil, viewType: Type<MetadataViews.NFTCollectionData>()) as! MetadataViews.NFTCollectionData?
     ?? panic("ViewResolver does not resolve NFTCollectionData view")

   // exit if packCollection exists
   if acct.storage.borrow<&HWGaragePack.Collection>(from: packCollectionData.storagePath) == nil {
     // create a new empty packCollection for HWGaragePack
     let packCollection: @{NonFungibleToken.Collection} <- HWGaragePack.createEmptyCollection(nftType: Type<@HWGaragePack.NFT>())

     // save HWGaragePack packCollection to the account
     acct.storage.save(<-packCollection, to: packCollectionData.storagePath)

     // create a public capability for the HWGaragePack packCollection
     acct.capabilities.unpublish(packCollectionData.publicPath) // remove any current pubCap
     let packCollectionCap: Capability<&HWGaragePack.Collection> = acct.capabilities.storage.issue<&HWGaragePack.Collection>(packCollectionData.storagePath)
     acct.capabilities.publish(packCollectionCap, at: packCollectionData.publicPath)
   }

   // HWGarageCard
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

   // HWGarageTokenV2
   let tokenCollectionDataV2: MetadataViews.NFTCollectionData = HWGarageTokenV2.resolveContractView(resourceType: nil, viewType: Type<MetadataViews.NFTCollectionData>()) as! MetadataViews.NFTCollectionData?
     ?? panic("ViewResolver does not resolve NFTCollectionData view")

   if acct.storage.borrow<&HWGarageTokenV2.Collection>(from: tokenCollectionDataV2.storagePath) == nil {
     // create a new empty tokenCollection for HWGarageTokenV2
     let tokenCollection: @{NonFungibleToken.Collection} <- HWGarageTokenV2.createEmptyCollection(nftType: Type<@HWGarageTokenV2.NFT>())

     // save HWGarageTokenV2 tokenCollection to the account
     acct.storage.save(<-tokenCollection, to: tokenCollectionDataV2.storagePath)

     // create a public capability for the HWGarageTokenV2 tokenCollection
     acct.capabilities.unpublish(tokenCollectionDataV2.publicPath) // remove any current pubCap
     let tokenCollectionCap = acct.capabilities.storage.issue<&HWGarageTokenV2.Collection>(tokenCollectionDataV2.storagePath)
     acct.capabilities.publish(tokenCollectionCap, at: tokenCollectionDataV2.publicPath)
   }

   // HWGarageCardV2
   let cardCollectionDataV2: MetadataViews.NFTCollectionData = HWGarageCardV2.resolveContractView(resourceType: nil, viewType: Type<MetadataViews.NFTCollectionData>()) as! MetadataViews.NFTCollectionData?
     ?? panic("ViewResolver does not resolve NFTCollectionData view")

   // exit if cardCollection exists
   if acct.storage.borrow<&HWGarageCardV2.Collection>(from: cardCollectionDataV2.storagePath) == nil {
     // create a new empty cardCollection for HWGarageCardV2
     let cardCollection: @{NonFungibleToken.Collection} <- HWGarageCardV2.createEmptyCollection(nftType: Type<@HWGarageCardV2.NFT>())

     // save HWGarageCardV2 cardCollection to the account
     acct.storage.save(<-cardCollection, to: cardCollectionDataV2.storagePath)

     // create a public capability for the HWGarageCardV2 cardCollection
     acct.capabilities.unpublish(cardCollectionDataV2.publicPath) // remove any current pubCap
     let cardCollectionCap = acct.capabilities.storage.issue<&HWGarageCardV2.Collection>(cardCollectionDataV2.storagePath)
     acct.capabilities.publish(cardCollectionCap, at: cardCollectionDataV2.publicPath)
   }

   // HWGaragePackV2
   let garagePackCollectionDataV2: MetadataViews.NFTCollectionData = HWGaragePackV2.resolveContractView(resourceType: nil, viewType: Type<MetadataViews.NFTCollectionData>()) as! MetadataViews.NFTCollectionData?
     ?? panic("ViewResolver does not resolve NFTCollectionData view")

   // exit if packCollection exists
   if acct.storage.borrow<&HWGaragePackV2.Collection>(from: garagePackCollectionDataV2.storagePath) == nil {
     // create a new empty packCollection for HWGaragePackV2
     let packCollection: @{NonFungibleToken.Collection} <- HWGaragePackV2.createEmptyCollection(nftType: Type<@HWGaragePackV2.NFT>())

     // save HWGaragePackV2 packCollection to the account
     acct.storage.save(<-packCollection, to: garagePackCollectionDataV2.storagePath)

     // create a public capability for the HWGaragePackV2 packCollection
     acct.capabilities.unpublish(garagePackCollectionDataV2.publicPath) // remove any current pubCap
     let packCollectionCap = acct.capabilities.storage.issue<&HWGaragePackV2.Collection>(garagePackCollectionDataV2.storagePath)
     acct.capabilities.publish(packCollectionCap, at: garagePackCollectionDataV2.publicPath)
   }
`
export const garagePreparePartOfInit = `
${garageRawInitPart}
`
