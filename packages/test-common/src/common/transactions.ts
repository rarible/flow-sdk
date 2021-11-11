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
const motoGpMint = `
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

// export type SecondaryCollections = "MotoGPCard" | "Evolution" | "TopShot"
// type TestTransactions = Record<SecondaryCollections, { init: string, mint: string }>

const evolution = {
	init: evolutionInit,
	mint: evolutionMint,
	createSet: evolutionCreateSet,
	createItem: evolutionCreateItem,
	addItemToSet: evolutionAddItemToSet,
}

export const testTransactions = {
	evolution,
	MotoGPCard: {
		init: motoGpInit,
		mint: motoGpMint,
	},
	TopShot: {
		init: topShotInit,
		mint: topShotMint,
	},
}
