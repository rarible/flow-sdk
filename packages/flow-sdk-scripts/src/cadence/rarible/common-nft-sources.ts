export const CommonNftSources = {
	borrow_nft: `
import NonFungibleToken from 0xNONFUNGIBLETOKEN
import CommonNFT from 0xCOMMONNFT

// Take CommonNFT token props by account address and tokenId
//
pub fun main(address: Address, tokenId: UInt64): &AnyResource {
    let collection = getAccount(address)
        .getCapability<&{NonFungibleToken.CollectionPublic}>(CommonNFT.collectionPublicPath)
        .borrow()
        ?? panic("NFT Collection not found")
    return collection.borrowNFT(id: tokenId)
}
`,
	check: `
import NonFungibleToken from 0xNONFUNGIBLETOKEN
import CommonNFT from 0xCOMMONNFT

// check CommonNFT collection is available on given address
//
pub fun main(address: Address): Bool {
    return getAccount(address)
        .getCapability<&{NonFungibleToken.Receiver}>(CommonNFT.collectionPublicPath)
        .check()
}
`,
	get_ids: `
import NonFungibleToken from 0xNONFUNGIBLETOKEN
import CommonNFT from 0xCOMMONNFT

// Take CommonNFT ids by account address
//
pub fun main(address: Address): [UInt64]? {
    let collection = getAccount(address)
        .getCapability<&{NonFungibleToken.CollectionPublic}>(CommonNFT.collectionPublicPath)
        .borrow()
        ?? panic("NFT Collection not found")
    return collection.getIDs()
}
`,
	setup_account: `
import NonFungibleToken from 0xNONFUNGIBLETOKEN
import CommonNFT from 0xCOMMONNFT

transaction {
    prepare(account: AuthAccount) {
        if account.borrow<&CommonNFT.Collection>(from: CommonNFT.collectionStoragePath) == nil {
            let collection <- CommonNFT.createEmptyCollection() as! @CommonNFT.Collection
            account.save(<- collection, to: CommonNFT.collectionStoragePath)
            account.link<&{NonFungibleToken.CollectionPublic,NonFungibleToken.Receiver}>(CommonNFT.collectionPublicPath, target: CommonNFT.collectionStoragePath)
        }
    }
}
`,
	mint: `
import NonFungibleToken from 0xNONFUNGIBLETOKEN
import CommonNFT from 0xCOMMONNFT

// Mint CommonNFT token to signer acct
//
transaction(metadata: String, royalties: [CommonNFT.Royalty]) {
    let minter: Capability<&CommonNFT.Minter>
    let receiver: Capability<&{NonFungibleToken.Receiver}>

    prepare(acct: AuthAccount) {
        if acct.borrow<&CommonNFT.Collection>(from: CommonNFT.collectionStoragePath) == nil {
            let collection <- CommonNFT.createEmptyCollection() as! @CommonNFT.Collection
            acct.save(<- collection, to: CommonNFT.collectionStoragePath)
            acct.link<&{NonFungibleToken.CollectionPublic,NonFungibleToken.Receiver}>(CommonNFT.collectionPublicPath, target: CommonNFT.collectionStoragePath)
        }

        self.minter = CommonNFT.minter()
        self.receiver = acct.getCapability<&{NonFungibleToken.Receiver}>(CommonNFT.collectionPublicPath)
    }

    execute {
        let minter = self.minter.borrow() ?? panic("Could not borrow receiver capability (maybe receiver not configured?)")
        minter.mintTo(creator: self.receiver, metadata: {"metaURI": metadata}, royalties: royalties)
    }
}
`,
	burn: `
import NonFungibleToken from 0xNONFUNGIBLETOKEN
import CommonNFT from 0xCOMMONNFT

// Burn CommonNFT on signer account by tokenId
//
transaction(tokenId: UInt64) {
    prepare(account: AuthAccount) {
        let collection = account.borrow<&CommonNFT.Collection>(from: CommonNFT.collectionStoragePath)!
        destroy collection.withdraw(withdrawID: tokenId)
    }
}
`,
	transfer: `
import NonFungibleToken from 0xNONFUNGIBLETOKEN
import CommonNFT from 0xCOMMONNFT

// transfer CommonNFT token with tokenId to given address
//
transaction(tokenId: UInt64, to: Address) {
    let token: @NonFungibleToken.NFT
    let receiver: Capability<&{NonFungibleToken.Receiver}>

    prepare(acct: AuthAccount) {
        let collection = acct.borrow<&CommonNFT.Collection>(from: CommonNFT.collectionStoragePath)
            ?? panic("Missing collection, NFT not found")
        self.token <- collection.withdraw(withdrawID: tokenId)
        self.receiver = getAccount(to).getCapability<&{NonFungibleToken.Receiver}>(CommonNFT.collectionPublicPath)
    }

    execute {
        let receiver = self.receiver.borrow()!
        receiver.deposit(token: <- self.token)
    }
}
`,

}