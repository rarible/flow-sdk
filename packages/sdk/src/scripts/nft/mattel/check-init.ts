export const checkInitMattelContracts = `
import NFTStorefrontV2 from address
import NonFungibleToken from 0xNonFungibleToken
import MetadataViews from 0xMetadataViews
import FungibleToken from 0xFungibleToken
import FlowToken from 0xFlowToken
import FiatToken from 0xFiatToken
import HWGarageCard from 0xHWGarageCard
import HWGarageCardV2 from 0xHWGarageCardV2
import HWGaragePack from 0xHWGaragePack
import HWGaragePackV2 from 0xHWGaragePackV2
import HWGarageTokenV2 from 0xHWGarageTokenV2
import BBxBarbieCard from 0xBBxBarbieCard
import BBxBarbiePack from 0xBBxBarbiePack
import BBxBarbieToken from 0xBBxBarbieToken
import Gamisodes from 0xGamisodes

access(all)
fun main(address: Address): {String: Bool} {
    let account = getAccount(address)

    let accountStatus: {String: Bool} = {}

    let nftPubPath = HWGarageCard.CollectionPublicPath
    let nftCollection = account.capabilities.get<&{NonFungibleToken.Receiver}>(nftPubPath).borrow()

    let packPubPath = HWGaragePack.CollectionPublicPath
    let packCollection = account.capabilities.get<&{NonFungibleToken.Receiver}>(packPubPath).borrow()

    let nftV2PubPath = HWGarageCardV2.CollectionPublicPath
    let nftV2Collection = account.capabilities.get<&{NonFungibleToken.Receiver}>(nftV2PubPath).borrow()

    let packV2PubPath = HWGaragePackV2.CollectionPublicPath
    let packV2Collection = account.capabilities.get<&{NonFungibleToken.Receiver}>(packV2PubPath).borrow()

    let tokenV2PubPath = HWGarageTokenV2.CollectionPublicPath
    let tokenV2Collection = account.capabilities.get<&{NonFungibleToken.Receiver}>(tokenV2PubPath).borrow()

    let nftBBPubPath = BBxBarbieCard.CollectionPublicPath
    let nftBBCollection = account.capabilities.get<&{NonFungibleToken.Receiver}>(nftBBPubPath).borrow()

    let packBBPubPath = BBxBarbiePack.CollectionPublicPath
    let packBBCollection = account.capabilities.get<&{NonFungibleToken.Receiver}>(packBBPubPath).borrow()

    let tokenBBPubPath = BBxBarbieToken.CollectionPublicPath
    let tokenBBCollection = account.capabilities.get<&{NonFungibleToken.Receiver}>(tokenBBPubPath).borrow()

    //todo enable later
    //let fiatTokenPubPath = FiatToken.VaultReceiverPubPath
    //let fiatTokenCollection = account.capabilities.get<&FiatToken.Vault{FungibleToken.Receiver}>(fiatTokenPubPath).borrow()

    //let NFTStorefrontV2 = NFTStorefrontV2.StorefrontPublicPath
    let StorefrontV2 = account.capabilities.borrow<&{NFTStorefrontV2.StorefrontPublic}>(
            NFTStorefrontV2.StorefrontPublicPath
        )

    //let gamisodesCollection = account.capabilities.get<&{NonFungibleToken.Receiver}>(Gamisodes.COLLECTION_PUBLIC_PATH)
                        //.borrow()


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

    if tokenV2Collection != nil {
        accountStatus.insert(key: "HWGarageTokenV2", true)
    } else {
        accountStatus.insert(key: "HWGarageTokenV2", false)
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

    //todo enable later
    //if fiatTokenCollection != nil {
    //    accountStatus.insert(key: "FiatToken", true)
    //} else {
    //    accountStatus.insert(key: "FiatToken", false)
    //}

    //if gamisodesCollection != nil {
    //    accountStatus.insert(key: "Gamisodes", true)
    //} else {
    //    accountStatus.insert(key: "Gamisodes", false)
    //}

    return accountStatus
}

`
