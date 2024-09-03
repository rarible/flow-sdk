import {HWGarageCard, HWGaragePack} from "./contracts"
import {barbieRawInitPart} from "./mattel/barbie"
import {garageRawInitPart} from "./mattel/garage"
import {getUSDCVaultInitTx, getVaultInitTx, vaultOptions} from "./init-vault"
import {gamisodesRawInitPart} from "./gamisodes"

export const txInitMattelContractsAndStorefrontV2: string = `
import NonFungibleToken from 0xNonFungibleToken
import MetadataViews from 0xMetadataViews
import FungibleToken from 0xFungibleToken
import FlowToken from 0xFlowToken
import FUSD from 0xFUSD
import FiatToken from 0xFiatToken
import HWGarageCard from 0xHWGarageCard
import HWGaragePack from 0xHWGaragePack
import HWGarageCardV2 from 0xHWGarageCardV2
import HWGaragePackV2 from 0xHWGaragePackV2
import HWGarageTokenV2 from 0xHWGarageTokenV2
import BBxBarbiePack from 0xBBxBarbiePack
import BBxBarbieCard from 0xBBxBarbieCard
import BBxBarbieToken from 0xBBxBarbieToken
import NFTStorefrontV2 from 0xNFTStorefrontV2

transaction() {
    prepare(acct: auth(BorrowValue, IssueStorageCapabilityController, PublishCapability, SaveValue, UnpublishCapability) &Account) {
${getUSDCVaultInitTx()}
${garageRawInitPart}
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
    }
    execute {
    }
}`


export const txInitNFTContractsAndStorefrontV2: string = `
import NonFungibleToken from 0xNonFungibleToken
import MetadataViews from 0xMetadataViews
import FungibleToken from 0xFungibleToken
import FlowToken from 0xFlowToken
import FUSD from 0xFUSD
import FiatToken from 0xFiatToken
import ${HWGarageCard.name} from 0xHWGarageCard
import ${HWGaragePack.name} from 0xHWGaragePack
import HWGarageCardV2 from 0xHWGarageCardV2
import HWGaragePackV2 from 0xHWGaragePackV2
import HWGarageTokenV2 from 0xHWGarageTokenV2
import BBxBarbiePack from 0xBBxBarbiePack
import BBxBarbieCard from 0xBBxBarbieCard
import BBxBarbieToken from 0xBBxBarbieToken
import NFTStorefrontV2 from 0xNFTStorefrontV2
//Gamisodes
import TokenForwarding from 0xTokenForwarding
import Gamisodes from 0xGamisodes
import NiftoryNFTRegistry from 0xNiftoryNFTRegistry
import NiftoryNonFungibleToken from 0xNiftoryNonFungibleToken

transaction() {
    prepare(acct: AuthAccount) {
${getVaultInitTx(vaultOptions["FiatToken"])}
${garageRawInitPart}
${barbieRawInitPart}
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
