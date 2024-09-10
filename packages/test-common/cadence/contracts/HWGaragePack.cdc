/*
*
*   This is an implemetation of a Flow Non-Fungible Token
*   It is not a part of the official standard but it is assumed to be
*   similar to how NFTs would implement the core functionality
*
*
*/

import "NonFungibleToken"
import "ViewResolver"
import "MetadataViews"
import "FungibleToken"

access(all) contract HWGaragePack: NonFungibleToken {

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
        uuid: UInt64,
        id: UInt64,
        seriesId: UInt64,
        editionId: UInt64,
        to: Address?
    )
    access(all) event TransferEvent(
        uuid: UInt64,
        id: UInt64,
        seriesId: UInt64,
        editionId: UInt64,
        to: Address?
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

    access(all) var name: String

    access(self) var collectionMetadata: {String: String}
    access(self) let idToPackMetadata: {UInt64: PackMetadata}

    access(all) struct PackMetadata {
        access(all) let metadata: {String: String}

        init(metadata: {String: String}) {
            self.metadata = metadata
        }
    }

    access(all) resource NFT: NonFungibleToken.NFT {
        access(all) let id: UInt64
        access(all) let packID: UInt64
        access(all) let packEditionID: UInt64
        access(all) view fun getMetadata(): {String: String} {
            if (HWGaragePack.idToPackMetadata[self.id] != nil) {
                return HWGaragePack.idToPackMetadata[self.id]!.metadata
            } else {
                return {}
            }
        }

        init(id: UInt64, packID: UInt64, packEditionID: UInt64) {
            self.id = id
            self.packID = packID
            self.packEditionID = packEditionID
            emit Mint(id: self.id)
        }

        access(all) fun createEmptyCollection(): @{NonFungibleToken.Collection} {
            return <-HWGaragePack.createEmptyCollection(nftType: Type<@HWGaragePack.NFT>())
        }

        access(all) view fun getViews(): [Type] {
            return [
                Type<MetadataViews.Display>(),
                Type<MetadataViews.ExternalURL>(),
                Type<MetadataViews.NFTCollectionData>(),
                Type<MetadataViews.NFTCollectionDisplay>(),
                Type<MetadataViews.Royalties>()
            ]
        }

        access(all) view fun resolveView(_ view: Type): AnyStruct? {
            switch view {
                case Type<MetadataViews.Display>():
                    var ipfsImage: MetadataViews.IPFSFile = MetadataViews.IPFSFile(cid: "No thumbnail cid set", path: "No thumbnail path set")
                    if (self.getMetadata().containsKey("thumbnailCID")) {
                        ipfsImage = MetadataViews.IPFSFile(cid: self.getMetadata()["thumbnailCID"]!, path: self.getMetadata()["thumbnailPath"])
                    }
                    return MetadataViews.Display(
                        name: self.getMetadata()["name"] ?? "Hot Wheels Garage Series 4 Pack #".concat(self.packEditionID.toString()),
                        description: self.getMetadata()["description"] ?? "Digital Pack Collectable from Hot Wheels Garage",
                        thumbnail: ipfsImage
                    )

                case Type<MetadataViews.ExternalURL>():
                    return MetadataViews.ExternalURL("")

                case Type<MetadataViews.NFTCollectionData>():
                    return HWGaragePack.resolveContractView(resourceType: Type<@HWGaragePack.NFT>(), viewType: Type<MetadataViews.NFTCollectionData>())

                case Type<MetadataViews.NFTCollectionDisplay>():
                    return HWGaragePack.resolveContractView(resourceType: Type<@HWGaragePack.NFT>(), viewType: Type<MetadataViews.NFTCollectionDisplay>())

                case Type<MetadataViews.Royalties>():
                    return HWGaragePack.resolveContractView(resourceType: Type<@HWGaragePack.NFT>(), viewType: Type<MetadataViews.Royalties>())
            }

            return nil
        }
}

    access(all) resource interface PackCollectionPublic {}

    access(all) resource Collection: PackCollectionPublic, NonFungibleToken.Collection {

        access(all) var ownedNFTs: @{UInt64: {NonFungibleToken.NFT}}

        access(all) fun deposit(token: @{NonFungibleToken.NFT}) {
            let HWGaragePack: @HWGaragePack.NFT <- token as! @HWGaragePack.NFT
            let HWGaragePackUUID: UInt64 = HWGaragePack.uuid
            let HWGaragePackSeriesID: UInt64 = 4
            let HWGaragePackID: UInt64 = HWGaragePack.id
            let HWGaragePackpackEditionID: UInt64 = HWGaragePack.packEditionID

            self.ownedNFTs[HWGaragePackID] <-! HWGaragePack
            emit Deposit(id: HWGaragePackID, to: self.owner?.address)
            emit DepositEvent(
                uuid: HWGaragePackUUID,
                id: HWGaragePackID,
                seriesId: HWGaragePackSeriesID,
                editionId: HWGaragePackpackEditionID,
                to: self.owner?.address
            )
        }

        access(all) view fun getLength(): Int {
            return self.ownedNFTs.length
        }

        init() {
            self.ownedNFTs <- {}
        }

        /// getSupportedNFTTypes returns a list of NFT types that this receiver accepts
        access(all) view fun getSupportedNFTTypes(): {Type: Bool} {
            let supportedTypes: {Type: Bool} = {}
            supportedTypes[Type<@HWGaragePack.NFT>()] = true
            return supportedTypes
        }

        /// Returns whether or not the given type is accepted by the collection
        /// A collection that can accept any type should just return true by default
        access(all) view fun isSupportedNFTType(type: Type): Bool {
            return type == Type<@HWGaragePack.NFT>()
        }

        access(NonFungibleToken.Withdraw) fun withdraw(withdrawID: UInt64): @{NonFungibleToken.NFT} {
            let token: @{NonFungibleToken.NFT} <- self.ownedNFTs.remove(key: withdrawID) ?? panic("missing NFT")
            emit Withdraw(id: token.id, from: self.owner?.address)
            return <- token
        }

        // access(all) fun destroyNFT(id: UInt64) {
        //     let nft <- self.ownedNFTs.remove(key: id) ?? panic("NFT not found in account")
        //     emit Burn(id: nft.id)
        //     destroy nft
        // }

        access(all) view fun getIDs(): [UInt64] {
            return self.ownedNFTs.keys
        }

        access(all) view fun borrowNFT(_ id: UInt64): &{NonFungibleToken.NFT}? {
            return (&self.ownedNFTs[id])
        }

        access(all) view fun borrowPack(id: UInt64): &NFT? {
            if let pack: &{NonFungibleToken.NFT} = &self.ownedNFTs[id] {
                return pack as! &NFT
            }
            return nil
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
            return <- HWGaragePack.createEmptyCollection(nftType: Type<@HWGaragePack.NFT>())
        }
    }


    /*
    *   Public Functions
    */

    access(all) fun createEmptyCollection(nftType: Type): @{NonFungibleToken.Collection} {
        return <- create Collection()
    }

    access(all) view fun getTotalSupply(): UInt64 {
        return self.totalSupply
    }

    access(all) view fun getName(): String {
        return self.name
    }

    access(all) fun transfer(uuid: UInt64, id: UInt64, packSeriesId: UInt64, packEditionId: UInt64, toAddress: Address) {

        let HWGaragePackV2UUID: UInt64 = uuid
        let HWGaragePackV2SeriesId: UInt64 = packSeriesId
        let HWGaragePackV2ID: UInt64 = id
        let HWGaragePackV2packEditionID: UInt64 = packEditionId

        emit TransferEvent(
            uuid: HWGaragePackV2UUID,
            id: HWGaragePackV2ID,
            seriesId: HWGaragePackV2SeriesId,
            editionId: HWGaragePackV2packEditionID,
            to: toAddress
        )
    }

    access(all) view fun getCollectionMetadata(): {String: String} {
        return self.collectionMetadata
    }

    access(all) view fun getEditionMetadata(_ edition: UInt64): {String: String} {
        if (self.idToPackMetadata[edition] != nil) {
            return self.idToPackMetadata[edition]!.metadata
        } else {
            return {}
        }
    }

    access(all) view fun getMetadataLength(): Int {
        return self.idToPackMetadata.length
    }

    access(all) view fun getPackMetadata(): AnyStruct {
        return self.idToPackMetadata
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
                        storagePath: HWGaragePack.CollectionStoragePath,
                        publicPath: HWGaragePack.CollectionPublicPath,
                        publicCollection: Type<&HWGaragePack.Collection>(),
                        publicLinkedType: Type<&HWGaragePack.Collection>(),
                        createEmptyCollectionFunction: (fun (): @{NonFungibleToken.Collection} {
                            return <-HWGaragePack.createEmptyCollection(nftType: Type<@HWGaragePack.NFT>())
                        })
                    )

                case Type<MetadataViews.NFTCollectionDisplay>():
                    let externalURL = MetadataViews.ExternalURL("")
                    let squareImage = MetadataViews.Media(
                        file: MetadataViews.HTTPFile(url: ""),
                        mediaType: "image/png"
                    )
                    let bannerImage = MetadataViews.Media(
                        file: MetadataViews.HTTPFile(url: ""),
                        mediaType: "image/png"
                    )
                    let socialMap: {String: MetadataViews.ExternalURL} = {
                        "facebook": MetadataViews.ExternalURL("https://www.facebook.com/hotwheels"),
                        "instagram": MetadataViews.ExternalURL("https://www.instagram.com/hotwheelsofficial/"),
                        "twitter": MetadataViews.ExternalURL("https://twitter.com/Hot_Wheels"),
                        "discord": MetadataViews.ExternalURL("https://discord.gg/mattel")
                    }
                    return MetadataViews.NFTCollectionDisplay(
                        name: "Hot Wheels Garage Pack",
                        description: "Digital Collectable from Hot Wheels Garage",
                        externalURL: externalURL,
                        squareImage: squareImage,
                        bannerImage: bannerImage,
                        socials: socialMap
                    )

                case Type<MetadataViews.Royalties>():
                    let flowReceiver = getAccount(0xf86e2f015cd692be).capabilities.get<&{FungibleToken.Receiver}>(/public/flowTokenReceiver)
                    return MetadataViews.Royalties([
                        MetadataViews.Royalty(
                            receiver: flowReceiver,
                            cut: 0.05,
                            description: "Mattel 5% Royalty"
                        )
                    ])
        }
        return nil
    }
    /*
    *   Admin Functions
    */
    access(account) fun setEditionMetadata(editionNumber: UInt64, metadata: {String: String}) {
        self.idToPackMetadata[editionNumber] = PackMetadata(metadata: metadata)
    }

    access(account) fun setCollectionMetadata(metadata: {String: String}) {
        self.collectionMetadata = metadata
    }

    access(account) fun mint(nftID: UInt64, packID: UInt64, packEditionID: UInt64): @NFT {
        self.totalSupply = self.totalSupply + 1
        return <- create NFT(id: nftID, packID: packID, packEditionID: packEditionID)
    }

    // initialize contract state variables
    init() {
        self.name = "HWGaragePack"
        self.totalSupply = 0

        self.collectionMetadata = {}
        self.idToPackMetadata = {}

        // set the named paths
        self.CollectionStoragePath = /storage/HWGaragePackCollection
        self.CollectionPublicPath = /public/HWGaragePackCollection

        // Create a collection resource and save it to storage
        let collection: @HWGaragePack.Collection <- create Collection()
        self.account.storage.save(<-collection, to: self.CollectionStoragePath)

        let collectionCap = self.account.capabilities.storage.issue<&HWGaragePack.Collection>(self.CollectionStoragePath)
        self.account.capabilities.publish(collectionCap, at: self.CollectionPublicPath)

        emit ContractInitialized()
    }

}
