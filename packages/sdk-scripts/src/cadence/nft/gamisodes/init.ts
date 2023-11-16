import {NFTStorefrontV2} from "../contracts"

export const gamisodesRawInitPart = `
        //Gamisodes INIT PART START
        if acct.borrow<&Gamisodes.Collection>(from: %nftStoragePath%) == nil {
          let collection <- Gamisodes.createEmptyCollection()
          acct.save(<-collection, to: %nftStoragePath%)
        }
        if (acct.getCapability<&Gamisodes.Collection{NiftoryNonFungibleToken.CollectionPublic,NonFungibleToken.CollectionPublic,NonFungibleToken.Receiver,MetadataViews.ResolverCollection}>(%nftPublicPath%).borrow() == nil) {
          acct.unlink(%nftPublicPath%)
          acct.link<&Gamisodes.Collection{NiftoryNonFungibleToken.CollectionPublic,NonFungibleToken.CollectionPublic,NonFungibleToken.Receiver,MetadataViews.ResolverCollection}>(%nftPublicPath%, target: %nftStoragePath%)
        }

        if (acct.getCapability<&Gamisodes.Collection{NiftoryNonFungibleToken.CollectionPublic,NonFungibleToken.CollectionPublic,NonFungibleToken.Provider,MetadataViews.ResolverCollection}>(%nftPrivatePath%).borrow() == nil) {
          acct.unlink(%nftPrivatePath%)
          acct.link<&Gamisodes.Collection{NiftoryNonFungibleToken.CollectionPublic,NonFungibleToken.CollectionPublic,NonFungibleToken.Provider,MetadataViews.ResolverCollection}>(%nftPrivatePath%, target: %nftStoragePath%)
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
