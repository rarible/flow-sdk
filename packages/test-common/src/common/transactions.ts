const evolutionMint = `
import Evolution from "Evolution.cdc"
transaction(recipient: Address, setId: UInt32, itemId: UInt32) {

    // Local variable for the Evolution Admin object
    let adminRef: &Evolution.Admin

    prepare(acct: AuthAccount) {

        // borrow a reference to the Admin resource in storage
        self.adminRef = acct.borrow<&Evolution.Admin>(from: /storage/EvolutionAdmin)!
    }

    execute {
        // borrow a reference to the set to be minted from
        let setRef = self.adminRef.borrowSet(setId: setId)

        // Mint all the new NFTs
        let collection <- setRef.batchMintCollectible(itemId: itemId, quantity: 9)

        // Get the account object for the recipient of the minted tokens
        let recipient = getAccount(recipient)

        // get the Collection reference for the receiver
        let receiverRef = recipient.getCapability(/public/f4264ac8f3256818_Evolution_Collection).borrow<&{Evolution.EvolutionCollectionPublic}>()
            ?? panic("Cannot borrow a reference to the recipient's collection")

        // deposit the NFT in the receivers collection
        receiverRef.batchDeposit(tokens: <-collection)
    }
}`
const evolutionInit = `
import Evolution from "Evolution.cdc"

transaction {

    prepare(acct: AuthAccount) {
        if acct.borrow<&Evolution.Collection>(from: /storage/f4264ac8f3256818_Evolution_Collection) == nil {
            let collection <- Evolution.createEmptyCollection() as! @Evolution.Collection
            acct.save(<-collection, to: /storage/f4264ac8f3256818_Evolution_Collection)
            acct.link<&{Evolution.EvolutionCollectionPublic}>(/public/f4264ac8f3256818_Evolution_Collection, target: /storage/f4264ac8f3256818_Evolution_Collection)
        }
    }
}`
const evolutionCreateItem = `
import Evolution from "Evolution.cdc"

// This transaction creates a new item struct
// and stores it in the Evolution smart contract

transaction(title: String, description: String, hash: String) {
    prepare(acct: AuthAccount) {

        // borrow a reference to the admin resource
        let admin = acct.borrow<&Evolution.Admin>(from: /storage/EvolutionAdmin)
            ?? panic("No admin resource in storage")
        admin.createItem(metadata: {"Title":title, "Description":description, "Hash":hash})
    }
}`
const evolutionCreateSet = `
import Evolution from "Evolution.cdc"

// This transaction creates a new item struct
// and stores it in the Evolution smart contract

transaction(name: String, description: String) {
    prepare(acct: AuthAccount) {

        // borrow a reference to the admin resource
        let admin = acct.borrow<&Evolution.Admin>(from: /storage/EvolutionAdmin)
            ?? panic("No admin resource in storage")
        admin.createSet(name: name, description: description)
    }
}
`
const evolutionAddItemToSet = `
import Evolution from "Evolution.cdc"

// This transaction creates a new item struct
// and stores it in the Evolution smart contract

transaction(setId: UInt32, itemIds: [UInt32]) {
    prepare(acct: AuthAccount) {
        // borrow a reference to the admin resource
        let admin = acct.borrow<&Evolution.Admin>(from: /storage/EvolutionAdmin)
            ?? panic("No admin resource in storage")

        let set = admin.borrowSet(setId: setId)
        set.addItems(itemIds: itemIds)
    }
}`

const motoGpInit = `
import MotoGPCard from "MotoGPCard.cdc"
import MotoGPPack from "MotoGPPack.cdc"

transaction {
    prepare(acct: AuthAccount) {
        if acct.borrow<&MotoGPPack.Collection>(from: /storage/motogpPackCollection) == nil {
            let packCollection <- MotoGPPack.createEmptyCollection()
            acct.save(<-packCollection, to: /storage/motogpPackCollection)
            acct.link<&MotoGPPack.Collection{MotoGPPack.IPackCollectionPublic, MotoGPPack.IPackCollectionAdminAccessible}>(/public/motogpPackCollection, target: /storage/motogpPackCollection)
        }
        if acct.borrow<&MotoGPCard.Collection>(from: /storage/motogpCardCollection) == nil {
            let cardCollection <- MotoGPCard.createEmptyCollection()
            acct.save(<-cardCollection, to: /storage/motogpCardCollection)
            acct.link<&MotoGPCard.Collection{MotoGPCard.ICardCollectionPublic}>(/public/motogpCardCollection, target: /storage/motogpCardCollection)
        }
    }

    execute {
    }
}`
const motoGpAddPackType = `
import MotoGPAdmin from "MotoGPAdmin.cdc"

transaction(pt: UInt64) {
    prepare(acct: AuthAccount) {
        let admin = acct.borrow<&MotoGPAdmin.Admin>(from: /storage/motogpAdmin)!
        admin.addPackType(packType: pt, numberOfCards: 10)
    }

    execute {
    }
}
`
const motoGpMintPackToAddress = `
import MotoGPAdmin from "MotoGPAdmin.cdc"
import MotoGPPack from "MotoGPPack.cdc"
import MotoGPTransfer from "MotoGPTransfer.cdc"

transaction(recipients: [Address], packTypes: [UInt64], packNumbers: [[UInt64]]) {
    var recipients: [Address]
    var packTypes: [UInt64]
    var packNumbers: [[UInt64]]
    var ids: [[UInt64]]
    let adminPackCollectionRef: &MotoGPPack.Collection
    let minterRef: &MotoGPAdmin.Admin
    prepare(acct: AuthAccount) {
        self.recipients = recipients
        self.packTypes = packTypes
        self.packNumbers = packNumbers
        self.ids = []
        let length = UInt64(self.recipients.length)
        var i = UInt64(0)
        self.minterRef = acct.borrow<&MotoGPAdmin.Admin>(from: /storage/motogpAdmin)
            ?? panic("Could not borrow the minter reference from the admin")
        while i < length {
            let tempPackType = self.packTypes[i]
            let tempPackNumbers = self.packNumbers[i]
            let tempPackCount = UInt64(tempPackNumbers.length)
            var nextId = MotoGPPack.totalSupply;
            self.minterRef.mintPacks(packType: tempPackType, numberOfPacks: tempPackCount, packNumbers: tempPackNumbers)
            let lastId = MotoGPPack.totalSupply - UInt64(1)
            let idList:[UInt64] = []
            while nextId <= lastId {
                idList.append(nextId)
                nextId = nextId + UInt64(1)
            }
            self.ids.append(idList)
            i = i + UInt64(1)
        }
        self.adminPackCollectionRef = acct.borrow<&MotoGPPack.Collection>(from: /storage/motogpPackCollection)
        ?? panic("Could not borrow the admin''s pack collection")
    }
    execute {
        let length = UInt64(self.recipients.length)
        var i = UInt64(0)
        while i < length {
            let recipientAccount = getAccount(self.recipients[i])
            let recipientPackCollectionRef = recipientAccount.getCapability(/public/motogpPackCollection)
                .borrow<&MotoGPPack.Collection{MotoGPPack.IPackCollectionPublic}>()
                    ?? panic("Could not borrow the public capability for the recipient''s account")
            let idList = self.ids[i]
            let idListLength = UInt64(idList.length)
            var j = UInt64(0)
            while j < idListLength {
                let packData = self.adminPackCollectionRef.borrowPack(id: idList[j]) ?? panic("Could not borrow the pack from admin''s collection")
                if packData.packInfo.packType == self.packTypes[i] && packData.packInfo.packNumber == self.packNumbers[i][j] {
                    let pack <- self.adminPackCollectionRef.withdraw(withdrawID: idList[j])
                    recipientPackCollectionRef.deposit(token: <- pack)
                }
                j = j + UInt64(1)
            }
            MotoGPTransfer.topUpFlowForAccount(adminRef: self.minterRef, toAddress: self.recipients[i])
            i = i + UInt64(1)
        }
    }
}
`
const motoGpTransferPackToOpener = `
import PackOpener from "PackOpener.cdc"
import MotoGPCard from "MotoGPCard.cdc"
import MotoGPPack from "MotoGPPack.cdc"
import MotoGPTransfer from "MotoGPTransfer.cdc"

transaction(id: UInt64, toAddress: Address) {
    var packCollectionRef: &MotoGPPack.Collection
    var packOpenerCollectionRef: &PackOpener.Collection

    prepare(acct: AuthAccount) {
        self.packCollectionRef = acct.borrow<&MotoGPPack.Collection>(from: /storage/motogpPackCollection)
            ?? panic("Could not borrow AuthAccount''s Pack collection")
        if acct.borrow<&PackOpener.Collection>(from: /storage/motogpPackOpenerCollection) == nil {
            let cardCollectionCap: Capability<&MotoGPCard.Collection{MotoGPCard.ICardCollectionPublic}> = acct.getCapability<&MotoGPCard.Collection{MotoGPCard.ICardCollectionPublic}>(/public/motogpCardCollection)
            let packOpenerCollection <- PackOpener.createEmptyCollection(cardCollectionCap: cardCollectionCap)
            acct.save(<- packOpenerCollection, to: PackOpener.packOpenerStoragePath)
            acct.link<&PackOpener.Collection{PackOpener.IPackOpenerPublic}>(PackOpener.packOpenerPublicPath, target: PackOpener.packOpenerStoragePath)
        }

        self.packOpenerCollectionRef = acct.borrow<&PackOpener.Collection>(from: PackOpener.packOpenerStoragePath)
            ?? panic("Could not borrow AuthAccount''s PackOpener collection")
    }

    execute {
        let pack <- self.packCollectionRef.withdraw(withdrawID: id) as! @MotoGPPack.NFT
        MotoGPTransfer.transferPackToPackOpenerCollection(pack: <- pack, toCollection: self.packOpenerCollectionRef, toAddress: toAddress)
    }
}
`
const motoGpOpenPack = `
import MotoGPAdmin from "MotoGPAdmin.cdc"
import PackOpener from "PackOpener.cdc"
import MotoGPCard from "MotoGPCard.cdc"
import MotoGPTransfer from "MotoGPTransfer.cdc"

transaction(recipientAddress: Address, packId: UInt64, cardIDs: [UInt64], serials: [UInt64]) {
  prepare(acct: AuthAccount) {
    let adminRef = acct.borrow<&MotoGPAdmin.Admin>(from: /storage/motogpAdmin)
    ?? panic("Could not borrow AuthAccount''s Admin reference")
    let packOpenerCollectionRef = getAccount(recipientAddress).getCapability(/public/motogpPackOpenerCollection)!.borrow<&PackOpener.Collection{PackOpener.IPackOpenerPublic}>()
    ?? panic("Could not borrow recipient''s PackOpener collection")
    packOpenerCollectionRef.openPack(adminRef:adminRef, id: packId, cardIDs: cardIDs, serials: serials)
    MotoGPTransfer.topUpFlowForAccount(adminRef: adminRef, toAddress: recipientAddress)
  }
  execute {
  }
}
`


const topShotInit = `
import TopShot from "TopShot.cdc"

// This transaction sets up an account to use Top Shot
// by storing an empty moment collection and creating
// a public capability for it

transaction {

    prepare(acct: AuthAccount) {

        // First, check to see if a moment collection already exists
        if acct.borrow<&TopShot.Collection>(from: /storage/MomentCollection) == nil {

            // create a new TopShot Collection
            let collection <- TopShot.createEmptyCollection() as! @TopShot.Collection

            // Put the new Collection in storage
            acct.save(<-collection, to: /storage/MomentCollection)

            // create a public capability for the collection
            acct.link<&{TopShot.MomentCollectionPublic}>(/public/MomentCollection, target: /storage/MomentCollection)
        }
    }
}`
const topShotMint = `
import TopShot from "TopShot.cdc"

// This transaction is what an admin would use to mint a single new moment
// and deposit it in a user's collection

// Parameters:
//
// setID: the ID of a set containing the target play
// playID: the ID of a play from which a new moment is minted
// recipientAddr: the Flow address of the account receiving the newly minted moment

transaction(setID: UInt32, playID: UInt32, recipientAddr: Address) {
    // local variable for the admin reference
    let adminRef: &TopShot.Admin

    prepare(acct: AuthAccount) {
        // borrow a reference to the Admin resource in storage
        self.adminRef = acct.borrow<&TopShot.Admin>(from: /storage/TopShotAdmin)!
    }

    execute {
        // Borrow a reference to the specified set
        let setRef = self.adminRef.borrowSet(setID: setID)

        // Mint a new NFT
        let moment1 <- setRef.mintMoment(playID: playID)

        // get the public account object for the recipient
        let recipient = getAccount(recipientAddr)

        // get the Collection reference for the receiver
        let receiverRef = recipient.getCapability(/public/MomentCollection).borrow<&{TopShot.MomentCollectionPublic}>()
            ?? panic("Cannot borrow a reference to the recipient's moment collection")

        // deposit the NFT in the receivers collection
        receiverRef.deposit(token: <-moment1)
    }
}`
const topShotCreatePlay = `
import TopShot from "TopShot.cdc"

// This transaction creates a new play struct
// and stores it in the Top Shot smart contract
// We currently stringify the metadata and insert it into the
// transaction string, but want to use transaction arguments soon

// Parameters:
//
// metadata: A dictionary of all the play metadata associated

transaction(metadata: {String: String}) {

    // Local variable for the topshot Admin object
    let adminRef: &TopShot.Admin
    let currPlayID: UInt32

    prepare(acct: AuthAccount) {

        // borrow a reference to the admin resource
        self.currPlayID = TopShot.nextPlayID;
        self.adminRef = acct.borrow<&TopShot.Admin>(from: /storage/TopShotAdmin)
            ?? panic("No admin resource in storage")
    }

    execute {

        // Create a play with the specified metadata
        self.adminRef.createPlay(metadata: metadata)
    }

    post {

        TopShot.getPlayMetaData(playID: self.currPlayID) != nil:
            "playID doesnt exist"
    }
}`
const topShotCreateSet = `
import TopShot from "TopShot.cdc"

// This transaction is for the admin to create a new set resource
// and store it in the top shot smart contract

// Parameters:
//
// setName: the name of a new Set to be created

transaction(setName: String) {

    // Local variable for the topshot Admin object
    let adminRef: &TopShot.Admin
    let currSetID: UInt32

    prepare(acct: AuthAccount) {

        // borrow a reference to the Admin resource in storage
        self.adminRef = acct.borrow<&TopShot.Admin>(from: /storage/TopShotAdmin)
            ?? panic("Could not borrow a reference to the Admin resource")
        self.currSetID = TopShot.nextSetID;
    }

    execute {

        // Create a set with the specified name
        self.adminRef.createSet(name: setName)
    }

    post {

        TopShot.getSetName(setID: self.currSetID) == setName:
          "Could not find the specified set"
    }
}`
const topShotAddPlaysToSet = `
import TopShot from "TopShot.cdc"

// This transaction adds multiple plays to a set
// Parameters:
//
// setID: the ID of the set to which multiple plays are added
// plays: an array of play IDs being added to the set

transaction(setID: UInt32, plays: [UInt32]) {

    // Local variable for the topshot Admin object
    let adminRef: &TopShot.Admin

    prepare(acct: AuthAccount) {

        // borrow a reference to the Admin resource in storage
        self.adminRef = acct.borrow<&TopShot.Admin>(from: /storage/TopShotAdmin)!
    }

    execute {

        // borrow a reference to the set to be added to
        let setRef = self.adminRef.borrowSet(setID: setID)

        // Add the specified play IDs
        setRef.addPlays(playIDs: plays)
    }
}`

// export type SecondaryCollections = "MotoGPCard" | "Evolution" | "TopShot"
// type TestTransactions = Record<SecondaryCollections, { init: string, mint: string }>

const evolution = {
	init: evolutionInit,
	mint: evolutionMint,
	createSet: evolutionCreateSet,
	createItem: evolutionCreateItem,
	addItemToSet: evolutionAddItemToSet,
}

const topShot = {
	init: topShotInit,
	mint: topShotMint,
	createPlay: topShotCreatePlay,
	createSet: topShotCreateSet,
	addPlaysToSet: topShotAddPlaysToSet,
}

const motoGpCard = {
	init: motoGpInit,
	addPackType: motoGpAddPackType,
	mintPackToAddress: motoGpMintPackToAddress,
	transferPackToOpener: motoGpTransferPackToOpener,
	openPack: motoGpOpenPack,
}

export const testTransactions = {
	evolution,
	motoGpCard,
	topShot,
}
