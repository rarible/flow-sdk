/*
*
*   An NFT contract for redeeming/minting tokens by series
*
*
*/

import "NonFungibleToken"
import "FungibleToken"
import "MetadataViews"
import "ViewResolver"

access(all) contract HWGarageTokenV2: NonFungibleToken {

    /*
    *   NonFungibleToken Standard Events
    */
    access(all) event ContractInitialized()
    access(all) event Withdraw(id: UInt64, from: Address?)
    access(all) event Deposit(id: UInt64, to: Address?)

    /*
    *   Project Events
    */
    access(all) event Mint(id: UInt64)
    access(all) event Burn(id: UInt64)
    access(all) event DepositEvent(
        uuid: UInt64
        , id: UInt64
        , seriesId: UInt64
        , editionId: UInt64
        , to: Address?
        )

    access(all) event TransferEvent(
        uuid: UInt64
        , id: UInt64
        , seriesId: UInt64
        , editionId: UInt64
        , to: Address?
        )
    /*
    *   Named Paths
    */
    access(all) let CollectionStoragePath: StoragePath
    access(all) let CollectionPublicPath: PublicPath

    /*
    *   NonFungibleToken Standard Fields
    */
    access(all) var totalSupply: UInt64

    /*
    *   Token State Variables
    */
    access(self) var name: String
    access(self) var currentTokenEditionIdByPackSeriesId: {UInt64: UInt64}

    access(all) resource NFT: NonFungibleToken.NFT {
        access(all) let id: UInt64
        // the pack series this Token came from
        access(all) let packSeriesID: UInt64
        access(all) let tokenEditionID: UInt64
        access(all) let metadata: {String: String}

        access(all) view fun getViews(): [Type] {
            return [
                Type<MetadataViews.Display>(),
                Type<MetadataViews.ExternalURL>(),
                Type<MetadataViews.NFTCollectionData>(),
                Type<MetadataViews.NFTCollectionDisplay>(),
                Type<MetadataViews.Royalties>(),
                Type<MetadataViews.Traits>(),
                Type<MetadataViews.Rarity>()
            ]
        }

        access(all) fun resolveView(_ view: Type): AnyStruct? {
            switch view {
                case Type<MetadataViews.Display>():
                    var ipfsImage = MetadataViews.IPFSFile(
                        cid: self.metadata["thumbnailCID"] ?? "ThumbnailCID not set"
                        , path: self.metadata["thumbnailPath"] ?? ""
                        )
                    return MetadataViews.Display(
                        name: self.metadata["tokenName"] ?? "Hot Wheels Garage Token Series ".concat(self.packSeriesID.toString()).concat(" #").concat(self.tokenEditionID.toString()),
                        description: self.metadata["tokenDescription"] ?? "Digital Redeemable Token Collectable from Hot Wheels Garage" ,
                        thumbnail: ipfsImage
                    )

                case Type<MetadataViews.ExternalURL>():
                    return MetadataViews.ExternalURL(
                    self.metadata["url"] ?? ""
                    )

                case Type<MetadataViews.NFTCollectionData>():
                    return HWGarageTokenV2.resolveContractView(resourceType: Type<@HWGarageTokenV2.NFT>(), viewType: Type<MetadataViews.NFTCollectionData>())

                case Type<MetadataViews.NFTCollectionDisplay>():
                    return HWGarageTokenV2.resolveContractView(resourceType: Type<@HWGarageTokenV2.NFT>(), viewType: Type<MetadataViews.NFTCollectionDisplay>())
                case Type<MetadataViews.Traits>():
                    let exludedTraits = [
                                "thumbnailPath"
                                , "thumbnailCID"
                                , "collectionName"
                                , "collectionDescription"
                                , "tokenDescription"
                                , "url"
                            ]
                    let traitsView = MetadataViews.dictToTraits(
                        dict: self.metadata,
                        excludedNames: exludedTraits
                    )
                    return traitsView
                case Type<MetadataViews.Royalties>():
                    return HWGarageTokenV2.resolveContractView(resourceType: Type<@HWGarageTokenV2.NFT>(), viewType: Type<MetadataViews.Royalties>())
                case Type<MetadataViews.Rarity>():
                    let rarityDescription = self.metadata["rarity"]
                    return MetadataViews.Rarity(
                    score: nil
                    , max: nil
                    ,description: rarityDescription
                )
            }
            return nil
        }

        init(
            id: UInt64
            , packSeriesID: UInt64
            , tokenEditionID: UInt64
            , metadata: {String: String}
            ) {
            self.id = id
            self.packSeriesID = packSeriesID
            self.tokenEditionID = tokenEditionID
            self.metadata = metadata
            emit Mint(id: self.id)
        }

        access(all) fun createEmptyCollection(): @{NonFungibleToken.Collection} {
            return <- HWGarageTokenV2.createEmptyCollection(nftType: Type<@HWGarageTokenV2.NFT>())
        }

    }

    access(all) resource interface TokenCollectionPublic {}

    access(all) resource Collection: TokenCollectionPublic, NonFungibleToken.Collection {
        access(all) var ownedNFTs: @{UInt64: {NonFungibleToken.NFT}}

        init() {
            self.ownedNFTs <- {}
        }

        /// getSupportedNFTTypes returns a list of NFT types that this receiver accepts
        access(all) view fun getSupportedNFTTypes(): {Type: Bool} {
            let supportedTypes: {Type: Bool} = {}
            supportedTypes[Type<@HWGarageTokenV2.NFT>()] = true
            return supportedTypes
        }

        /// Returns whether or not the given type is accepted by the collection
        /// A collection that can accept any type should just return true by default
        access(all) view fun isSupportedNFTType(type: Type): Bool {
            return type == Type<@HWGarageTokenV2.NFT>()
        }

        access(NonFungibleToken.Withdraw) fun withdraw(withdrawID: UInt64): @{NonFungibleToken.NFT} {
            let token <- self.ownedNFTs.remove(key: withdrawID) ?? panic("missing NFT")

            emit Withdraw(
                id: token.id,
                from: self.owner?.address
                )

            return <-token
        }


        access(all) fun deposit(token: @{NonFungibleToken.NFT}) {
            let HWGarageTokenV2: @HWGarageTokenV2.NFT <- token as! @HWGarageTokenV2.NFT
            let HWGarageTokenV2UUID: UInt64 = HWGarageTokenV2.uuid
            let HWGarageTokenV2SeriesID: UInt64 = HWGarageTokenV2.packSeriesID
            let HWGarageTokenV2ID: UInt64 = HWGarageTokenV2.id
            let HWGarageTokenV2tokenEditionID: UInt64 = HWGarageTokenV2.tokenEditionID

            self.ownedNFTs[HWGarageTokenV2ID] <-! HWGarageTokenV2

            emit Deposit(
                id: HWGarageTokenV2ID,
                to: self.owner?.address
                )
            emit DepositEvent(
                uuid: HWGarageTokenV2UUID,
                id: HWGarageTokenV2ID,
                seriesId: HWGarageTokenV2SeriesID,
                editionId: HWGarageTokenV2tokenEditionID,
                to: self.owner?.address
                )
        }


        access(all) view fun getIDs(): [UInt64] {
            return self.ownedNFTs.keys
        }

        access(all) view fun getLength(): Int {
            return self.ownedNFTs.keys.length
        }

        access(all) view fun borrowNFT(_ id: UInt64): &{NonFungibleToken.NFT}? {
            return (&self.ownedNFTs[id])
        }


        access(all) view fun borrowToken(id: UInt64): &NFT? {
            if let tokenRef: &{NonFungibleToken.NFT} = &self.ownedNFTs[id] {
                return tokenRef as! &NFT
            } else {
                return nil
            }
        }


        access(all) view fun borrowViewResolver(id: UInt64): &{ViewResolver.Resolver}? {
            if let nftRef: &{NonFungibleToken.NFT} = &self.ownedNFTs[id] {
                return nftRef as &{ViewResolver.Resolver}
            }
        return nil
        }

        access(all) fun createEmptyCollection(): @{NonFungibleToken.Collection} {
            return <- HWGarageTokenV2.createEmptyCollection(nftType: Type<@HWGarageTokenV2.NFT>())
        }
    }



    /*
    *   Public Functions
    */
    access(all) view fun getTotalSupply(): UInt64 {
        return self.totalSupply
    }


    access(all) view fun getName(): String {
        return self.name
    }


    access(all) fun transfer(uuid: UInt64, id: UInt64, packSeriesId: UInt64, tokenEditionId: UInt64, toAddress: Address){

        let HWGarageTokenV2UUID: UInt64 = uuid
        let HWGarageTokenV2SeriesId: UInt64 = packSeriesId
        let HWGarageTokenV2ID: UInt64 = id
        let HWGarageTokenV2tokenEditionID: UInt64 = tokenEditionId

        emit TransferEvent(
            uuid: HWGarageTokenV2UUID
            , id: HWGarageTokenV2ID
            , seriesId: HWGarageTokenV2SeriesId
            , editionId: HWGarageTokenV2tokenEditionID
            , to: toAddress)
    }



    access(all) fun createEmptyCollection(nftType: Type): @{NonFungibleToken.Collection} {
        return <- create Collection()
    }

        access(all) view fun getContractViews(resourceType: Type?): [Type] {
            return [
                Type<MetadataViews.NFTCollectionData>(),
                Type<MetadataViews.NFTCollectionDisplay>(),
                Type<MetadataViews.Royalties>()

            ]
        }

        access(all) view fun resolveContractView(resourceType: Type?, viewType: Type): AnyStruct? {
            switch viewType {

                case Type<MetadataViews.NFTCollectionData>():
                    return MetadataViews.NFTCollectionData(
                        storagePath: HWGarageTokenV2.CollectionStoragePath,
                        publicPath: HWGarageTokenV2.CollectionPublicPath,
                        publicCollection: Type<&HWGarageTokenV2.Collection>(),
                        publicLinkedType: Type<&HWGarageTokenV2.Collection>(),
                        createEmptyCollectionFunction: fun(): @{NonFungibleToken.Collection} {return <- HWGarageTokenV2.createEmptyCollection(nftType: Type<@HWGarageTokenV2.NFT>())
                        })

                case Type<MetadataViews.NFTCollectionDisplay>():
                    let externalURL: MetadataViews.ExternalURL = MetadataViews.ExternalURL(
                        ""
                        )

                    let squareImage = MetadataViews.Media(
                        file: MetadataViews.HTTPFile(
                            url: ""
                            ),
                        mediaType: "image/png")

                    let bannerImage = MetadataViews.Media(
                        file: MetadataViews.HTTPFile(
                            url: ""
                            ),
                        mediaType: "image/png")

                    let socialMap: {String: MetadataViews.ExternalURL} = {
                        "facebook": MetadataViews.ExternalURL(
                            "https://www.facebook.com/hotwheels"
                            ),
                        "instagram": MetadataViews.ExternalURL(
                            "https://www.instagram.com/hotwheelsofficial/"
                            ),
                        "twitter": MetadataViews.ExternalURL(
                            "https://twitter.com/Hot_Wheels"
                            ),
                        "discord": MetadataViews.ExternalURL(
                            "https://discord.gg/mattel"
                            )
                    }
                    return MetadataViews.NFTCollectionDisplay(
                        name: "Hot Wheels Garage Redeemable Token",
                        description:"Digital Collectable from Hot Wheels Garage",
                        externalURL: externalURL,
                        squareImage: squareImage,
                        bannerImage: bannerImage,
                        socials: socialMap
                        )

                case Type<MetadataViews.Royalties>():
                    let flowReciever = getAccount(0xf86e2f015cd692be).capabilities.get<&{FungibleToken.Receiver}>(/public/flowTokenReceiver)
                    return MetadataViews.Royalties([
                        MetadataViews.Royalty(
                            receiver:flowReciever
                            , cut: 0.05
                            , description: "Mattel 5% Royalty")
                    ]
                )
            }
            return nil
        }

    /*
    *   Admin Functions
    */
    access(account) fun addNewSeries(newTokenSeriesID: UInt64){
        self.currentTokenEditionIdByPackSeriesId.insert(key: newTokenSeriesID, 0)
    }


    access(account) fun updateCurrentEditionIdByPackSeriesId(packSeriesID: UInt64, tokenSeriesEdition: UInt64){
        self.currentTokenEditionIdByPackSeriesId[packSeriesID] = tokenSeriesEdition
    }


    access(account) fun mint(
        nftID: UInt64
        , packSeriesID: UInt64
        , metadata: {String: String}
        ): @{NonFungibleToken.NFT} {

        self.totalSupply = self.getTotalSupply() + 1

        self.currentTokenEditionIdByPackSeriesId[packSeriesID] = self.currentTokenEditionIdByPackSeriesId[packSeriesID]! + 1

        return <- create NFT(
            id: nftID
            , packSeriesID: packSeriesID
            , tokenEditionID: self.currentTokenEditionIdByPackSeriesId[packSeriesID]!
            , metadata: metadata
            )
    }

    // initialize contract state variables
    init(){
        self.name = "Hot Wheels Garage Token v2"
        self.totalSupply = 0
        self.currentTokenEditionIdByPackSeriesId = {1 : 0}

        // set the named paths
        self.CollectionStoragePath = /storage/HWGarageTokenV2Collection
        self.CollectionPublicPath = /public/HWGarageTokenV2Collection

        // create a collection resource and save it to storage
        let collection: @HWGarageTokenV2.Collection <- create Collection()
        self.account.storage.save(<-collection, to: self.CollectionStoragePath)

        let collectionCap = self.account.capabilities.storage.issue<&HWGarageTokenV2.Collection>(self.CollectionStoragePath)
        self.account.capabilities.publish(collectionCap, at: self.CollectionPublicPath)

        emit ContractInitialized()
    }

}

