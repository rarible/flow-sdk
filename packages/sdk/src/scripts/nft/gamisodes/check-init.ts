export const checkInitGamisodesContracts = `
import NFTStorefrontV2 from address
import NonFungibleToken from 0xNonFungibleToken
import MetadataViews from 0xMetadataViews
import FungibleToken from 0xFungibleToken
import FlowToken from 0xFlowToken
import FiatToken from 0xFiatToken
import Gamisodes from 0xGamisodes

pub fun main(address: Address): {String: Bool} {
    let account = getAccount(address)

    let accountStatus: {String: Bool} = {}

    let fiatTokenPubPath = FiatToken.VaultReceiverPubPath
    let fiatTokenCollection = account.getCapability<&FiatToken.Vault{FungibleToken.Receiver}>(fiatTokenPubPath).borrow()

    let NFTStorefrontV2 = NFTStorefrontV2.StorefrontPublicPath
    let StorefrontV2 = account.getCapability(NFTStorefrontV2).borrow<&{NFTStorefrontV2.StorefrontPublic}>()

    let gamisodesCollection = account.getCapability(Gamisodes.COLLECTION_PUBLIC_PATH)
                        .borrow<&{NonFungibleToken.Receiver}>()

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

    if gamisodesCollection != nil {
        accountStatus.insert(key: "Gamisodes", true)
    } else {
        accountStatus.insert(key: "Gamisodes", false)
    }

    return accountStatus
}

`
