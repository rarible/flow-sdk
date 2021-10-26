export const Evolution = {
	setup_account: `
import Evolution from 0xEVOLUTION

// Setup storage for Evolution on signer account
//
transaction {
    prepare(acct: AuthAccount) {
        if acct.borrow<&Evolution.Collection>(from: /storage/f4264ac8f3256818_Evolution_Collection) == nil {
            let collection <- Evolution.createEmptyCollection() as! @Evolution.Collection
            acct.save(<-collection, to: /storage/f4264ac8f3256818_Evolution_Collection)
            acct.link<&{Evolution.EvolutionCollectionPublic}>(/public/f4264ac8f3256818_Evolution_Collection, target: /storage/f4264ac8f3256818_Evolution_Collection)
        }
    }
}
`,
	transfer: `
import NonFungibleToken from 0xNONFUNGIBLETOKEN
import Evolution from 0xEVOLUTION

// transfer Evolution token with tokenId to given address
//
transaction(tokenId: UInt64, to: Address) {
    let token: @NonFungibleToken.NFT
    let receiver: Capability<&{Evolution.EvolutionCollectionPublic}>

    prepare(acct: AuthAccount) {
        let collection = acct.borrow<&Evolution.Collection>(from: /storage/f4264ac8f3256818_Evolution_Collection)
            ?? panic("Missing NFT collection on signer account")
        self.token <- collection.withdraw(withdrawID: tokenId)
        self.receiver = getAccount(to).getCapability<&{Evolution.EvolutionCollectionPublic}>(/public/f4264ac8f3256818_Evolution_Collection)
    }

    execute {
        let receiver = self.receiver.borrow()!
        receiver.deposit(token: <- self.token)
    }
}
`,
	burn: `
import Evolution from 0xEVOLUTION

// Burn Evolution on signer account by tokenId
//
transaction(tokenId: UInt64) {
    prepare(account: AuthAccount) {
        let collection = account.borrow<&Evolution.Collection>(from: /storage/f4264ac8f3256818_Evolution_Collection)!
        destroy collection.withdraw(withdrawID: tokenId)
    }
}
`,

}