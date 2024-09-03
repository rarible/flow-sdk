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
        //Gamisodes INIT PART END
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
    }
    execute {
    }
}`
