export const CommonNFT = {
	setup_account: `
import NonFungibleToken from 0xNONFUNGIBLETOKEN
import CommonNFT from 0xCOMMONNFT

// Setup storage for CommonNFT on signer account
//
transaction {
    prepare(acct: AuthAccount) {
        if acct.borrow<&CommonNFT.Collection>(from: CommonNFT.collectionStoragePath) == nil {
            let collection <- CommonNFT.createEmptyCollection() as! @CommonNFT.Collection
            acct.save(<-collection, to: CommonNFT.collectionStoragePath)
            acct.link<&{NonFungibleToken.CollectionPublic,NonFungibleToken.Receiver}>(CommonNFT.collectionPublicPath, target: CommonNFT.collectionStoragePath)
        }
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
    let receiver: Capability<&{NonFungibleToken.CollectionPublic,NonFungibleToken.Receiver}>

    prepare(acct: AuthAccount) {
        let collection = acct.borrow<&CommonNFT.Collection>(from: CommonNFT.collectionStoragePath)
            ?? panic("Missing NFT collection on signer account")
        self.token <- collection.withdraw(withdrawID: tokenId)
        self.receiver = getAccount(to).getCapability<&{NonFungibleToken.CollectionPublic,NonFungibleToken.Receiver}>(CommonNFT.collectionPublicPath)
    }

    execute {
        let receiver = self.receiver.borrow()!
        receiver.deposit(token: <- self.token)
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

}