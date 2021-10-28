export const TopShot = {
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