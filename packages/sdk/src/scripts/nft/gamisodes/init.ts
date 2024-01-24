import { NFTStorefrontV2 } from "../contracts"
import {getVaultInitTx, vaultOptions} from "../init-vault"

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


export const txInitGamisodesContractsAndStorefrontV2: string = `
import NonFungibleToken from 0xNonFungibleToken
import MetadataViews from 0xMetadataViews
import FungibleToken from 0xFungibleToken
import FlowToken from 0xFlowToken
import FUSD from 0xFUSD
import FiatToken from 0xFiatToken
import NFTStorefrontV2 from 0xNFTStorefrontV2
//Gamisodes
import TokenForwarding from 0xTokenForwarding
import Gamisodes from 0xGamisodes
import NiftoryNFTRegistry from 0xNiftoryNFTRegistry
import NiftoryNonFungibleToken from 0xNiftoryNonFungibleToken

transaction() {
    prepare(acct: AuthAccount) {
${getVaultInitTx(vaultOptions["FiatToken"])}
${gamisodesRawInitPart}

			if acct.borrow<&${NFTStorefrontV2.name}.${NFTStorefrontV2.contractType}>(from: ${NFTStorefrontV2.storagePath}) == nil {
					let collection <- ${NFTStorefrontV2.name}.${NFTStorefrontV2.nameOfMethodForCreateResource}
					acct.save(<-collection, to: ${NFTStorefrontV2.storagePath})
			}
			if acct.getCapability<${NFTStorefrontV2.publicType}>(${NFTStorefrontV2.publicPath}).borrow() == nil {
					acct.link<${NFTStorefrontV2.publicType}>(${NFTStorefrontV2.publicPath}, target: ${NFTStorefrontV2.storagePath})
			}
    }
    execute {
    }
}`
