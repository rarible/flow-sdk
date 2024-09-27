/*
*
*   This is an implemetation of a Flow Non-Fungible Token
*   It is not a part of the official standard but it is assumed to be
*   similar to how NFTs would implement the core functionality
*
*
*/

import "NonFungibleToken"
import "FungibleToken"
import "MetadataViews"
import "ViewResolver"

access(all) contract BBxBarbiePack: NonFungibleToken {

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
    *   Pack State Variables
    */
    access(account) var name: String
    access(account) var currentPackEditionIdByPackSeriesId: {UInt64: UInt64}


    access(all) resource NFT: NonFungibleToken.NFT {
        access(all) let id: UInt64
        access(all) let packSeriesID: UInt64
        access(all) let packEditionID: UInt64
        access(all) let packHash: String
        access(all) let metadata: {String: String}

        access(all) view fun getViews(): [Type] {
            return [
                Type<MetadataViews.Display>(),
                Type<MetadataViews.ExternalURL>(),
                Type<MetadataViews.NFTCollectionData>(),
                Type<MetadataViews.NFTCollectionDisplay>(),
                Type<MetadataViews.Royalties>(),
                Type<MetadataViews.Traits>()
            ]
        }


        access(all) fun resolveView(_ view: Type): AnyStruct? {
            switch view {
                case Type<MetadataViews.Display>():
                    var ipfsImage = MetadataViews.IPFSFile(
                        cid: self.metadata["thumbnailCID"] ?? "No ThumnailCID set"
                        , path: self.metadata["thumbnailPath"] ?? "No ThumbnailPath set"
                        )
                    return MetadataViews.Display(
                        name: self.metadata["packName"]?.concat(" #")?.concat(self.packEditionID.toString()) ?? "Boss Beauties x Barbie Pack",
                        description: self.metadata["description"] ?? "Digital Pack Collectable from the Boss Beauties x Barbie collaboration" ,
                        thumbnail: ipfsImage
                    )

                case Type<MetadataViews.ExternalURL>():
                    return MetadataViews.ExternalURL(
                        self.metadata["url"] ?? ""
                        )

                case Type<MetadataViews.NFTCollectionData>():
                    return BBxBarbiePack.resolveContractView(resourceType: Type<@BBxBarbiePack.NFT>(), viewType: Type<MetadataViews.NFTCollectionData>())
                case Type<MetadataViews.NFTCollectionDisplay>():
                    return BBxBarbiePack.resolveContractView(resourceType: Type<@BBxBarbiePack.NFT>(), viewType: Type<MetadataViews.NFTCollectionDisplay>())
                case Type<MetadataViews.Traits>():
                    let excludedTraits = [
                                "thumbnailPath"
                                , "thumbnailCID"
                                , "collectionName"
                                , "collectionDescription"
                                , "description"
                                , "url"
                            ]
                    let traitsView = MetadataViews.dictToTraits(
                        dict: self.metadata
                        , excludedNames: excludedTraits
                        )
                    return traitsView
                case Type<MetadataViews.Royalties>():
                    return BBxBarbiePack.resolveContractView(resourceType: Type<@BBxBarbiePack.NFT>(), viewType: Type<MetadataViews.Royalties>())
            }

            return nil
        }


        init(
            id: UInt64
            , packSeriesID: UInt64
            , packEditionID: UInt64
            , packHash: String
            , metadata: {String: String}
            ) {
            self.id = id
            self.packSeriesID = packSeriesID
            self.packEditionID = packEditionID
            self.packHash = packHash
            self.metadata = metadata
            emit Mint(id: self.packEditionID)
        }


        access(all) fun createEmptyCollection(): @{NonFungibleToken.Collection} {
            return <-BBxBarbiePack.createEmptyCollection(nftType: Type<@BBxBarbiePack.NFT>())
        }
    }

    access(all) resource interface PackCollectionPublic {}

    access(all) resource Collection: PackCollectionPublic, NonFungibleToken.Collection {
        access(all) var ownedNFTs: @{UInt64: {NonFungibleToken.NFT}}

        init() {
            self.ownedNFTs <- {}
        }


        /// getSupportedNFTTypes returns a list of NFT types that this receiver accepts
        access(all) view fun getSupportedNFTTypes(): {Type: Bool} {
            let supportedTypes: {Type: Bool} = {}
            supportedTypes[Type<@BBxBarbiePack.NFT>()] = true
            return supportedTypes
        }

        /// Returns whether or not the given type is accepted by the collection
        /// A collection that can accept any type should just return true by default
        access(all) view fun isSupportedNFTType(type: Type): Bool {
            return type == Type<@BBxBarbiePack.NFT>()
        }

        access(NonFungibleToken.Withdraw) fun withdraw(withdrawID: UInt64): @{NonFungibleToken.NFT} {
            let BBxBarbiePack <- self.ownedNFTs.remove(
                key: withdrawID
                ) ?? panic("missing NFT")
            emit Withdraw(
                id: BBxBarbiePack.id,
                from: self.owner?.address
                )
            return <-BBxBarbiePack
        }

        access(all) fun deposit(
            token: @{NonFungibleToken.NFT}
            ) {
            let BBxBarbiePack <- token as! @BBxBarbiePack.NFT
            let BBxBarbiePackUUID: UInt64 = BBxBarbiePack.uuid
            let BBxBarbiePackSeriesId: UInt64 = BBxBarbiePack.packSeriesID
            let BBxBarbiePackID: UInt64 = BBxBarbiePack.id
            let BBxBarbiePackEditionID: UInt64 = BBxBarbiePack.packEditionID
            self.ownedNFTs[BBxBarbiePackID] <-! BBxBarbiePack
            emit Deposit(
                id: BBxBarbiePackID,
                to: self.owner?.address
            )
            emit DepositEvent(
                uuid:BBxBarbiePackUUID
                , id: BBxBarbiePackID
                , seriesId: BBxBarbiePackSeriesId
                , editionId: BBxBarbiePackEditionID
                , to: self.owner?.address
            )
        }

        access(all) view fun getIDs(): [UInt64] {
            return self.ownedNFTs.keys
        }


        access(all) view fun getLength(): Int {
            return self.ownedNFTs.keys.length
        }


        access(all) view fun borrowNFT(_ id: UInt64): &{NonFungibleToken.NFT}?{
            return (&self.ownedNFTs[id])
        }

        access(all) fun borrowPack(id: UInt64): &NFT? {
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


        /// Allows a given function to iterate through the list
        /// of owned NFT IDs in a collection without first
        /// having to load the entire list into memory
        access(all) fun forEachID(_ f: fun(UInt64): Bool) {
            self.ownedNFTs.forEachKey(f)
        }


        access(all) fun createEmptyCollection(): @{NonFungibleToken.Collection} {
            return <- BBxBarbiePack.createEmptyCollection(nftType: Type<@BBxBarbiePack.NFT>())
        }
    }

    /*
    *   Public Functions
    */

    access(all) fun createEmptyCollection(nftType: Type): @{NonFungibleToken.Collection} {
        return <- create Collection()
    }

    access(all) fun getTotalSupply(): UInt64 {
        return self.totalSupply
    }


    access(all) fun getName(): String {
        return self.name
    }

    access(all) fun transfer(uuid: UInt64, id: UInt64, packSeriesId: UInt64, packEditionId: UInt64, toAddress: Address){

        let BBxBarbiePackV2UUID: UInt64 = uuid
        let BBxBarbiePackV2SeriesId: UInt64 = packSeriesId
        let BBxBarbiePackV2ID: UInt64 = id
        let BBxBarbiePackV2packEditionID: UInt64 = packEditionId

        emit TransferEvent(
            uuid: BBxBarbiePackV2UUID
            , id: BBxBarbiePackV2ID
            , seriesId: BBxBarbiePackV2SeriesId
            , editionId: BBxBarbiePackV2packEditionID
            , to: toAddress)
    }

access(all) view fun getContractViews(resourceType: Type?): [Type] {
    return [
                Type<MetadataViews.NFTCollectionData>(),
                Type<MetadataViews.NFTCollectionDisplay>(),
                Type<MetadataViews.Royalties>()
            ]
}

access(all) view fun resolveContractView(resourceType: Type?, viewType: Type): AnyStruct?{
    switch viewType {
                case Type<MetadataViews.NFTCollectionData>():
                    return MetadataViews.NFTCollectionData(
                        storagePath: BBxBarbiePack.CollectionStoragePath,
                        publicPath: BBxBarbiePack.CollectionPublicPath,
                        publicCollection: Type<&BBxBarbiePack.Collection>(),
                        publicLinkedType: Type<&BBxBarbiePack.Collection>(),
                        createEmptyCollectionFunction: fun(): @{NonFungibleToken.Collection} {return <- BBxBarbiePack.createEmptyCollection(nftType: Type<@BBxBarbiePack.NFT>())
                        })

                case Type<MetadataViews.NFTCollectionDisplay>():
                    let externalURL = MetadataViews.ExternalURL(
                        "https://www.mattel.com/"
                        )
                    let squareImage = MetadataViews.Media(
                        file: MetadataViews.HTTPFile(
                            url: "https://www.mattel.com/"
                            ),
                        mediaType: "image/png")
                    let bannerImage = MetadataViews.Media(
                        file: MetadataViews.HTTPFile(
                            url: "https://www.mattel.com/"
                            ),
                        mediaType: "image/png")
                    let socialMap: {String: MetadataViews.ExternalURL} = {
                        "facebook": MetadataViews.ExternalURL(
                            "https://www.facebook.com/mattel"
                            ),
                        "instagram": MetadataViews.ExternalURL(
                            "https://www.instagram.com/mattel"
                            ),
                        "twitter": MetadataViews.ExternalURL(
                            "https://www.twitter.com/mattel"
                            )
                    }
                    return MetadataViews.NFTCollectionDisplay(
                        name: "Boss Beauties x Barbie Pack",
                        description: "Digital Collectable from the Boss Beauties x Barbie collaboration",
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
    access(account) fun addNewSeries(newPackSeriesID: UInt64){
        self.currentPackEditionIdByPackSeriesId.insert(key: newPackSeriesID, 0)
    }


    access(account) fun updateCurrentEditionIdByPackSeriesId(packSeriesID: UInt64, packSeriesEdition: UInt64){
        self.currentPackEditionIdByPackSeriesId[packSeriesID] = packSeriesEdition
    }


    access(account) fun mint(
        nftID: UInt64
        , packEditionID: UInt64
        , packSeriesID: UInt64
        , packHash: String
        , metadata: {String: String}
        ): @{NonFungibleToken.NFT} {
        self.totalSupply = self.totalSupply + 1
        self.currentPackEditionIdByPackSeriesId[packSeriesID] = self.currentPackEditionIdByPackSeriesId[packSeriesID]! + 1
        return <- create NFT(
            id: nftID
            , packSeriesID: packSeriesID
            , packEditionID: self.currentPackEditionIdByPackSeriesId[packSeriesID]!
            , packHash: packHash
            , metadata: metadata
            )
    }



    // initialize contract state variables
    init(){
        self.name = "Boss Beauties x Barbie Pack"
        self.totalSupply = 0
        self.currentPackEditionIdByPackSeriesId = {1 : 0}

        // set the named paths
        self.CollectionStoragePath = /storage/BBxBarbiePackCollection
        self.CollectionPublicPath = /public/BBxBarbiePackCollection

        // create a collection resource and save it to storage
        let collection: @BBxBarbiePack.Collection <- create Collection()
        self.account.storage.save(<-collection, to: self.CollectionStoragePath)

        let collectionCap = self.account.capabilities.storage.issue<&BBxBarbiePack.Collection>(self.CollectionStoragePath)
        self.account.capabilities.publish(collectionCap, at: self.CollectionPublicPath)

        emit ContractInitialized()
    }

}

