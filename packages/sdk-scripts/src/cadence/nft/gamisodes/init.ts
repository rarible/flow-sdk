export const gamisodesRawInitPart = `
        //Gamisodes INIT PART START
        let brand = Gamisodes.REGISTRY_BRAND
        let registryAddress = Gamisodes.REGISTRY_ADDRESS
        let paths = NiftoryNFTRegistry.getCollectionPaths(registryAddress, brand)

        // First, check to see if a NFT Collection already exists in the account's Gamisodes collection storage path
        if acct.borrow<&NonFungibleToken.Collection>(from: paths.storage) == nil {
            let nftManager = NiftoryNFTRegistry.getNFTManagerPublic(registryAddress, brand)
            let collection <- nftManager.getNFTCollectionData().createEmptyCollection()
            acct.save(<-collection, to: paths.storage)

            acct.unlink(paths.public)
            acct.link<&{
                NonFungibleToken.Receiver,
                NonFungibleToken.CollectionPublic,
                MetadataViews.ResolverCollection,
                NiftoryNonFungibleToken.CollectionPublic
            }>(paths.public, target: paths.storage)

            acct.unlink(paths.private)
            acct.link<&{
                NonFungibleToken.Provider,
                NiftoryNonFungibleToken.CollectionPrivate
            }>(paths.private, target: paths.storage)
        }
        let customerStorageAccount = false

        if (customerStorageAccount) {
            ////////////////
            // Storefront //
            ////////////////

            if acct.borrow<&NFTStorefrontV2.Storefront>(
                from: NFTStorefrontV2.StorefrontStoragePath
            ) == nil {
                let storefront <- NFTStorefrontV2.createStorefront()
                acct.save(<-storefront, to: NFTStorefrontV2.StorefrontStoragePath)
                acct.link<&NFTStorefrontV2.Storefront{NFTStorefrontV2.StorefrontPublic}>(
                    NFTStorefrontV2.StorefrontPublicPath,
                    target: NFTStorefrontV2.StorefrontStoragePath
                )
            }

            /////////////////////////////
            // Dapper Token Forwarding //
            /////////////////////////////

            if acct.borrow<&TokenForwarding.Forwarder>(
                from: /storage/dapperUtilityCoinReceiver
            ) == nil {
                let dapper = getAccount(0x82ec283f88a62e65)
                let receiver = dapper.getCapability(
                    /public/dapperUtilityCoinReceiver
                )
                let forwarder <- TokenForwarding.createNewForwarder(
                    recipient: receiver
                )
                acct.save(
                    <-forwarder,
                    to: /storage/dapperUtilityCoinReceiver
                )
                acct.link<&{FungibleToken.Receiver}>(
                    /public/dapperUtilityCoinReceiver,
                    target: /storage/dapperUtilityCoinReceiver
                )
            }

            if acct.borrow<&TokenForwarding.Forwarder>(
                from: /storage/flowUtilityTokenReceiver
            ) == nil {
                let dapper = getAccount(0x82ec283f88a62e65)
                let receiver = dapper.getCapability(
                    /public/flowUtilityTokenReceiver
                )
                let forwarder <- TokenForwarding.createNewForwarder(
                    recipient: receiver
                )
                acct.save(
                    <-forwarder,
                    to: /storage/flowUtilityTokenReceiver
                )
                acct.link<&{FungibleToken.Receiver}>(
                    /public/flowUtilityTokenReceiver,
                    target: /storage/flowUtilityTokenReceiver
                )
            }
        }
        //Gamisodes INIT PART START
`

export const anotherOneInit = `
import Gamisodes from 0x09e04bdbcccde6ca
import NiftoryNonFungibleToken from 0x7ec1f607f0872a9e
import NonFungibleToken from 0x1d7e57aa55817448
import MetadataViews from 0x1d7e57aa55817448

  transaction() {
    prepare(signer: AuthAccount) {
      if signer.borrow<&NonFungibleToken.Collection>(from: /storage/cl9bquwn300010hkzt0td7pec_Gamisodes_nft_collection) == nil {
        signer.save(<- Gamisodes.createEmptyCollection(), to: /storage/cl9bquwn300010hkzt0td7pec_Gamisodes_nft_collection)
        signer.link<&Gamisodes.Collection{NiftoryNonFungibleToken.CollectionPublic, NonFungibleToken.CollectionPublic, NonFungibleToken.Receiver, MetadataViews.ResolverCollection}>(/public/cl9bquwn300010hkzt0td7pec_Gamisodes_nft_collection, target: /storage/cl9bquwn300010hkzt0td7pec_Gamisodes_nft_collection)
      }
    }
  }
 `

export const anInit = `

    import NonFungibleToken from 0x1d7e57aa55817448
    import MetadataViews from 0x1d7e57aa55817448
    import NiftoryNonFungibleToken from 0x7ec1f607f0872a9e
    import NiftoryNFTRegistry from 0x7ec1f607f0872a9e
    import Gamisodes from 0x09e04bdbcccde6ca

    transaction {
        prepare(acct: AuthAccount) {
            let paths = NiftoryNFTRegistry.getCollectionPaths(0x32d62d5c43ad1038, "cl9bquwn300010hkzt0td7pec_Gamisodes")

            if acct.borrow<&NonFungibleToken.Collection>(from: paths.storage) == nil {
                let nftManager = NiftoryNFTRegistry.getNFTManagerPublic(0x32d62d5c43ad1038, "cl9bquwn300010hkzt0td7pec_Gamisodes")
                let collection <- nftManager.getNFTCollectionData().createEmptyCollection()
                acct.save(<-collection, to: paths.storage)

                acct.unlink(paths.public)
                acct.link<&{
                    NonFungibleToken.Receiver,
                    NonFungibleToken.CollectionPublic,
                    MetadataViews.ResolverCollection,
                    NiftoryNonFungibleToken.CollectionPublic
                }>(paths.public, target: paths.storage)

                acct.unlink(paths.private)
                acct.link<&{
                    NonFungibleToken.Provider,
                    NiftoryNonFungibleToken.CollectionPrivate
                }>(paths.private, target: paths.storage)
            }
        }
    }
    `

export const withdrawTx = `
import Gamisodes from 0x371ebe4bc55f8925
import NonFungibleToken from 0x631e88ae7f1d7c20

transaction(recipient: Address, maxNumToTransfer: Int) {
  let Collection: &Gamisodes.Collection
  let Recipient: &{NonFungibleToken.Receiver}

  prepare(signer: AuthAccount) {
    self.Collection = signer.borrow<&Gamisodes.Collection>(from: Gamisodes.COLLECTION_STORAGE_PATH)
                          ?? panic("This wallet does not have a Gamisodes Collection set up.")
    self.Recipient = getAccount(recipient).getCapability(Gamisodes.COLLECTION_PUBLIC_PATH)
                        .borrow<&{NonFungibleToken.Receiver}>()
                        ?? panic("The recipient does not have a Gamisodes Collection set up.")
  }

  execute {
    for i, id in self.Collection.getIDs() {
      self.Recipient.deposit(token: <- self.Collection.withdraw(withdrawID: id))
      // don't transfer more than maxNumToTransfer to prevent gas limit problems
      if i == maxNumToTransfer {
        break
      }
    }
  }
`
