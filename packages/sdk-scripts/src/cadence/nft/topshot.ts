export const TopShot = {
	get_ids: `
import NonFungibleToken from 0xNONFUNGIBLETOKEN
import TopShot from 0xTOPSHOT

// Take TopShot ids by account address
//
pub fun main(address: Address): [UInt64]? {
    let collection = getAccount(address)
        .getCapability(/public/MomentCollection)
        .borrow<&{TopShot.MomentCollectionPublic}>()
        ?? panic("NFT Collection not found")
    return collection.getIDs()
}
`,
	borrow_nft: `
import NonFungibleToken from 0xNONFUNGIBLETOKEN
import TopShot from 0xTOPSHOT

// Take TopShot token props by account address and tokenId
//
pub fun main(address: Address, tokenId: UInt64): &AnyResource {
    let collection = getAccount(address)
        .getCapability(/public/MomentCollection)
        .borrow<&{TopShot.MomentCollectionPublic}>()
        ?? panic("NFT Collection not found")
    return collection.borrowNFT(id: tokenId)
}
`,
	check: `
import NonFungibleToken from 0xNONFUNGIBLETOKEN
    import TopShot from 0xTOPSHOT

    // check TopShot collection is available on given address
    //
    pub fun main(address: Address): Bool {
        return getAccount(address)
            .getCapability<&{TopShot.MomentCollectionPublic}>(/public/MomentCollection)
            .check()
    }
`,
	setup_account: `
import TopShot from 0xTOPSHOT

// Setup storage for TopShot on signer account
//
transaction {
    prepare(acct: AuthAccount) {
        if acct.borrow<&TopShot.Collection>(from: /storage/MomentCollection) == nil {
            let collection <- TopShot.createEmptyCollection() as! @TopShot.Collection
            acct.save(<-collection, to: /storage/MomentCollection)
            acct.link<&{TopShot.MomentCollectionPublic}>(/public/MomentCollection, target: /storage/MomentCollection)
        }
    }
}
`,
	transfer: `
import NonFungibleToken from 0xNONFUNGIBLETOKEN
import TopShot from 0xTOPSHOT

// transfer TopShot token with tokenId to given address
//
transaction(tokenId: UInt64, to: Address) {
    let token: @NonFungibleToken.NFT
    let receiver: Capability<&{TopShot.MomentCollectionPublic}>

    prepare(acct: AuthAccount) {
        let collection = acct.borrow<&TopShot.Collection>(from: /storage/MomentCollection)
            ?? panic("Missing NFT collection on signer account")
        self.token <- collection.withdraw(withdrawID: tokenId)
        self.receiver = getAccount(to).getCapability<&{TopShot.MomentCollectionPublic}>(/public/MomentCollection)
    }

    execute {
        let receiver = self.receiver.borrow()!
        receiver.deposit(token: <- self.token)
    }
}
`,
	burn: `
import TopShot from 0xTOPSHOT

// Burn TopShot on signer account by tokenId
//
transaction(tokenId: UInt64) {
    prepare(account: AuthAccount) {
        let collection = account.borrow<&TopShot.Collection>(from: /storage/MomentCollection)!
        destroy collection.withdraw(withdrawID: tokenId)
    }
}
`,

}