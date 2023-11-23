import {BBxBarbieCard, BBxBarbiePack, NFTStorefrontV2} from "../../contracts"

export const barbieRawInitPart = `
      if acct.borrow<&BBxBarbieToken.Collection>(from: BBxBarbieToken.CollectionStoragePath) == nil {
          let collection <- BBxBarbieToken.createEmptyCollection()
          acct.save(<-collection, to: BBxBarbieToken.CollectionStoragePath)
      }
      if acct.getCapability<&BBxBarbieToken.Collection{NonFungibleToken.CollectionPublic, NonFungibleToken.Receiver, BBxBarbieToken.TokenCollectionPublic, MetadataViews.ResolverCollection}>(BBxBarbieToken.CollectionPublicPath).borrow() == nil {
          acct.link<&BBxBarbieToken.Collection{NonFungibleToken.CollectionPublic, NonFungibleToken.Receiver, BBxBarbieToken.TokenCollectionPublic, MetadataViews.ResolverCollection}>(BBxBarbieToken.CollectionPublicPath, target: BBxBarbieToken.CollectionStoragePath)
      }

			if acct.borrow<&${BBxBarbiePack.name}.${BBxBarbiePack.contractType}>(from: ${BBxBarbiePack.storagePath}) == nil {
					let collection <- ${BBxBarbiePack.name}.${BBxBarbiePack.nameOfMethodForCreateResource}
					acct.save(<-collection, to: ${BBxBarbiePack.storagePath})
			}
			if acct.getCapability<${BBxBarbiePack.publicType}>(${BBxBarbiePack.publicPath}).borrow() == nil {
					acct.link<${BBxBarbiePack.publicType}>(${BBxBarbiePack.publicPath}, target: ${BBxBarbiePack.storagePath})
			}

			if acct.borrow<&${BBxBarbieCard.name}.${BBxBarbieCard.contractType}>(from: ${BBxBarbieCard.storagePath}) == nil {
					let collection <- ${BBxBarbieCard.name}.${BBxBarbieCard.nameOfMethodForCreateResource}
					acct.save(<-collection, to: ${BBxBarbieCard.storagePath})
			}
			if acct.getCapability<${BBxBarbieCard.publicType}>(${BBxBarbieCard.publicPath}).borrow() == nil {
					acct.link<${BBxBarbieCard.publicType}>(${BBxBarbieCard.publicPath}, target: ${BBxBarbieCard.storagePath})
			}
`
export const barbiePreparePartOfInit = `
${barbieRawInitPart}

			if acct.borrow<&${NFTStorefrontV2.name}.${NFTStorefrontV2.contractType}>(from: ${NFTStorefrontV2.storagePath}) == nil {
					let collection <- ${NFTStorefrontV2.name}.${NFTStorefrontV2.nameOfMethodForCreateResource}
					acct.save(<-collection, to: ${NFTStorefrontV2.storagePath})
			}
			if acct.getCapability<${NFTStorefrontV2.publicType}>(${NFTStorefrontV2.publicPath}).borrow() == nil {
					acct.link<${NFTStorefrontV2.publicType}>(${NFTStorefrontV2.publicPath}, target: ${NFTStorefrontV2.storagePath})
			}
`
