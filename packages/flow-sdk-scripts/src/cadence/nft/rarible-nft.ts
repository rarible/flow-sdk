export const RaribleNFT = {
	get_ids: `
import NonFungibleToken from 0xNONFUNGIBLETOKEN
import RaribleNFT from 0xRARIBLENFT

// Take RaribleNFT ids by account address
//
pub fun main(address: Address): [UInt64]? {
    let collection = getAccount(address)
        .getCapability(RaribleNFT.collectionPublicPath)
        .borrow<&{NonFungibleToken.CollectionPublic,NonFungibleToken.Receiver}>()
        ?? panic("NFT Collection not found")
    return collection.getIDs()
}
`,
	borrow_nft: `
import NonFungibleToken from 0xNONFUNGIBLETOKEN
import RaribleNFT from 0xRARIBLENFT

// Take RaribleNFT token props by account address and tokenId
//
pub fun main(address: Address, tokenId: UInt64): &AnyResource {
    let collection = getAccount(address)
        .getCapability(RaribleNFT.collectionPublicPath)
        .borrow<&{NonFungibleToken.CollectionPublic,NonFungibleToken.Receiver}>()
        ?? panic("NFT Collection not found")
    return collection.borrowNFT(id: tokenId)
}
`,
	check: `
import NonFungibleToken from 0xNONFUNGIBLETOKEN
    import RaribleNFT from 0xRARIBLENFT

    // check RaribleNFT collection is available on given address
    //
    pub fun main(address: Address): Bool {
        return getAccount(address)
            .getCapability<&{NonFungibleToken.CollectionPublic,NonFungibleToken.Receiver}>(RaribleNFT.collectionPublicPath)
            .check()
    }
`,
	setup_account: `
import NonFungibleToken from 0xNONFUNGIBLETOKEN
import RaribleNFT from 0xRARIBLENFT

// Setup storage for RaribleNFT on signer account
//
transaction {
    prepare(acct: AuthAccount) {
        if acct.borrow<&RaribleNFT.Collection>(from: RaribleNFT.collectionStoragePath) == nil {
            let collection <- RaribleNFT.createEmptyCollection() as! @RaribleNFT.Collection
            acct.save(<-collection, to: RaribleNFT.collectionStoragePath)
            acct.link<&{NonFungibleToken.CollectionPublic,NonFungibleToken.Receiver}>(RaribleNFT.collectionPublicPath, target: RaribleNFT.collectionStoragePath)
        }
    }
}
`,
	transfer: `
import NonFungibleToken from 0xNONFUNGIBLETOKEN
import RaribleNFT from 0xRARIBLENFT

// transfer RaribleNFT token with tokenId to given address
//
transaction(tokenId: UInt64, to: Address) {
    let token: @NonFungibleToken.NFT
    let receiver: Capability<&{NonFungibleToken.CollectionPublic,NonFungibleToken.Receiver}>

    prepare(acct: AuthAccount) {
        let collection = acct.borrow<&RaribleNFT.Collection>(from: RaribleNFT.collectionStoragePath)
            ?? panic("Missing NFT collection on signer account")
        self.token <- collection.withdraw(withdrawID: tokenId)
        self.receiver = getAccount(to).getCapability<&{NonFungibleToken.CollectionPublic,NonFungibleToken.Receiver}>(RaribleNFT.collectionPublicPath)
    }

    execute {
        let receiver = self.receiver.borrow()!
        receiver.deposit(token: <- self.token)
    }
}
`,
	burn: `
import NonFungibleToken from 0xNONFUNGIBLETOKEN
import RaribleNFT from 0xRARIBLENFT

// Burn RaribleNFT on signer account by tokenId
//
transaction(tokenId: UInt64) {
    prepare(account: AuthAccount) {
        let collection = account.borrow<&RaribleNFT.Collection>(from: RaribleNFT.collectionStoragePath)!
        destroy collection.withdraw(withdrawID: tokenId)
    }
}
`,

}