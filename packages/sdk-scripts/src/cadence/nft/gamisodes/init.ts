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
        //Gamisodes INIT PART START
`
