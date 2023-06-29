export const checkInitMattelContracts = `
import NFTStorefrontV2 from address
import NonFungibleToken from 0xNonFungibleToken
import MetadataViews from 0xMetadataViews
import FungibleToken from 0xFungibleToken
import FlowToken from 0xFlowToken
import FiatToken from 0xFiatToken
import FUSD from 0xFUSD
import HWGarageCard from 0xHWGarageCard
import HWGarageCardV2 from 0xHWGarageCardV2
import HWGaragePack from 0xHWGaragePack
import HWGaragePackV2 from 0xHWGaragePackV2
import BBxBarbieCard from 0xBBxBarbieCard
import BBxBarbiePack from 0xBBxBarbiePack
import BBxBarbieToken from 0xBBxBarbieToken

pub fun main(address: Address): {String: Bool} {
    let account = getAccount(address)

    let accountStatus: {String: Bool} = {}

    let nftPubPath = HWGarageCard.CollectionPublicPath
    let nftCollection = account.getCapability<&HWGarageCard.Collection{NonFungibleToken.CollectionPublic,NonFungibleToken.Receiver,HWGarageCard.HWGarageCardCollectionPublic,MetadataViews.ResolverCollection}>(nftPubPath).borrow()

    let packPubPath = HWGaragePack.CollectionPublicPath
    let packCollection = account.getCapability<&HWGaragePack.Collection{NonFungibleToken.CollectionPublic,NonFungibleToken.Receiver,HWGaragePack.PackCollectionPublic,MetadataViews.ResolverCollection}>(packPubPath).borrow()

    let nftV2PubPath = HWGarageCardV2.CollectionPublicPath
    let nftV2Collection = account.getCapability<&HWGarageCardV2.Collection{NonFungibleToken.CollectionPublic, NonFungibleToken.Receiver, HWGarageCardV2.CardCollectionPublic, MetadataViews.ResolverCollection}>(nftV2PubPath).borrow()

    let packV2PubPath = HWGaragePackV2.CollectionPublicPath
    let packV2Collection = account.getCapability<&HWGaragePackV2.Collection{NonFungibleToken.CollectionPublic, NonFungibleToken.Receiver, HWGaragePackV2.PackCollectionPublic, MetadataViews.ResolverCollection}>(packV2PubPath).borrow()

    let nftBBPubPath = BBxBarbieCard.CollectionPublicPath
    let nftBBCollection = account.getCapability<&BBxBarbieCard.Collection{NonFungibleToken.CollectionPublic, NonFungibleToken.Receiver, BBxBarbieCard.CardCollectionPublic, MetadataViews.ResolverCollection}>(nftBBPubPath).borrow()

    let packBBPubPath = BBxBarbiePack.CollectionPublicPath
    let packBBCollection = account.getCapability<&BBxBarbiePack.Collection{NonFungibleToken.CollectionPublic, NonFungibleToken.Receiver, BBxBarbiePack.PackCollectionPublic, MetadataViews.ResolverCollection}>(packBBPubPath).borrow()

    let tokenBBPubPath = BBxBarbieToken.CollectionPublicPath
    let tokenBBCollection = account.getCapability<&BBxBarbieToken.Collection{NonFungibleToken.CollectionPublic, NonFungibleToken.Receiver, BBxBarbieToken.TokenCollectionPublic, MetadataViews.ResolverCollection}>(tokenBBPubPath).borrow()

    let fiatTokenPubPath = FiatToken.VaultReceiverPubPath
    let fiatTokenCollection = account.getCapability<&FiatToken.Vault{FungibleToken.Receiver}>(fiatTokenPubPath).borrow()

    let fusdTokenPubPath = /public/fusdVault
    let fusdCollection = account.getCapability<&FUSD.Vault{FungibleToken.Receiver}>(/public/fusdReceiver).borrow()

    let NFTStorefrontV2 = NFTStorefrontV2.StorefrontPublicPath
    let StorefrontV2 = account.getCapability(NFTStorefrontV2).borrow<&{NFTStorefrontV2.StorefrontPublic}>()

    if nftCollection != nil {
        accountStatus.insert(key: "HWGarageCard", true)
    } else {
        accountStatus.insert(key: "HWGarageCard", false)
    }

    if nftV2Collection != nil {
            accountStatus.insert(key: "HWGarageCardV2", true)
        } else {
            accountStatus.insert(key: "HWGarageCardV2", false)
        }

    if packCollection != nil {
        accountStatus.insert(key: "HWGaragePack", true)
    } else {
        accountStatus.insert(key: "HWGaragePack", false)
    }

    if packV2Collection != nil {
        accountStatus.insert(key: "HWGaragePackV2", true)
    } else {
        accountStatus.insert(key: "HWGaragePackV2", false)
    }

    if nftBBCollection != nil {
        accountStatus.insert(key: "BBxBarbieCard", true)
    } else {
        accountStatus.insert(key: "BBxBarbieCard", false)
    }

    if packBBCollection != nil {
        accountStatus.insert(key: "BBxBarbiePack", true)
    } else {
        accountStatus.insert(key: "BBxBarbiePack", false)
    }

    if tokenBBCollection != nil {
        accountStatus.insert(key: "BBxBarbieToken", true)
    } else {
        accountStatus.insert(key: "BBxBarbieToken", false)
    }

    if StorefrontV2 != nil {
        accountStatus.insert(key: "StorefrontV2", true)
    } else {
        accountStatus.insert(key: "StorefrontV2", false)
    }

    if fiatTokenCollection != nil {
        accountStatus.insert(key: "FiatToken", true)
    } else {
        accountStatus.insert(key: "FiatToken", false)
    }

    if fusdCollection != nil {
        accountStatus.insert(key: "FUSD", true)
    } else {
        accountStatus.insert(key: "FUSD", false)
    }

    return accountStatus
}

`
