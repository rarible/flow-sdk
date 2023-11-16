import {NFTStorefrontV2} from "../contracts"

export const gamisodesRawInitPart = `
        //Gamisodes INIT PART START
        if acct.borrow<&Gamisodes.Collection>(from: Gamisodes.COLLECTION_STORAGE_PATH) == nil {
          let collection <- Gamisodes.createEmptyCollection()
          acct.save(<-collection, to: Gamisodes.COLLECTION_STORAGE_PATH)
        }
        if (acct.getCapability<&Gamisodes.Collection{NiftoryNonFungibleToken.CollectionPublic,NonFungibleToken.CollectionPublic,NonFungibleToken.Receiver,MetadataViews.ResolverCollection}>(Gamisodes.COLLECTION_PUBLIC_PATH).borrow() == nil) {
          acct.unlink(Gamisodes.COLLECTION_PUBLIC_PATH)
          acct.link<&Gamisodes.Collection{NiftoryNonFungibleToken.CollectionPublic,NonFungibleToken.CollectionPublic,NonFungibleToken.Receiver,MetadataViews.ResolverCollection}>(Gamisodes.COLLECTION_PUBLIC_PATH, target: Gamisodes.COLLECTION_STORAGE_PATH)
        }

        if (acct.getCapability<&Gamisodes.Collection{NiftoryNonFungibleToken.CollectionPublic,NonFungibleToken.CollectionPublic,NonFungibleToken.Provider,MetadataViews.ResolverCollection}>(Gamisodes.COLLECTION_PRIVATE_PATH).borrow() == nil) {
          acct.unlink(Gamisodes.COLLECTION_PRIVATE_PATH)
          acct.link<&Gamisodes.Collection{NiftoryNonFungibleToken.CollectionPublic,NonFungibleToken.CollectionPublic,NonFungibleToken.Provider,MetadataViews.ResolverCollection}>(Gamisodes.COLLECTION_PRIVATE_PATH, target: Gamisodes.COLLECTION_STORAGE_PATH)
        }

        if acct.borrow<&${NFTStorefrontV2.name}.${NFTStorefrontV2.contractType}>(from: ${NFTStorefrontV2.storagePath}) == nil {
				  	let collection <- ${NFTStorefrontV2.name}.${NFTStorefrontV2.nameOfMethodForCreateResource}
  					acct.save(<-collection, to: ${NFTStorefrontV2.storagePath})
			  }
        if acct.getCapability<${NFTStorefrontV2.publicType}>(${NFTStorefrontV2.publicPath}).borrow() == nil {
            acct.link<${NFTStorefrontV2.publicType}>(${NFTStorefrontV2.publicPath}, target: ${NFTStorefrontV2.storagePath})
        }
        //Gamisodes INIT PART START
`
