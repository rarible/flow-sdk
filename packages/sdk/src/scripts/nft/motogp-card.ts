export const MotoGPCard = {
	get_ids: `
import NonFungibleToken from 0xNONFUNGIBLETOKEN
import MotoGPCard from 0xMOTOGPCARD

// Take MotoGPCard ids by account address
//
pub fun main(address: Address): [UInt64]? {
    let collection = getAccount(address)
        .getCapability(/public/motogpCardCollection)
        .borrow<&MotoGPCard.Collection{MotoGPCard.ICardCollectionPublic}>()
        ?? panic("NFT Collection not found")
    return collection.getIDs()
}
`,
	borrow_nft: `
import NonFungibleToken from 0xNONFUNGIBLETOKEN
import MotoGPCard from 0xMOTOGPCARD

// Take MotoGPCard token props by account address and tokenId
//
pub fun main(address: Address, tokenId: UInt64): &AnyResource {
    let collection = getAccount(address)
        .getCapability(/public/motogpCardCollection)
        .borrow<&MotoGPCard.Collection{MotoGPCard.ICardCollectionPublic}>()
        ?? panic("NFT Collection not found")
    return collection.borrowNFT(id: tokenId)
}
`,
	check: `
import NonFungibleToken from 0xNONFUNGIBLETOKEN
    import MotoGPCard from 0xMOTOGPCARD

    // check MotoGPCard collection is available on given address
    //
    pub fun main(address: Address): Bool {
        return getAccount(address)
            .getCapability<&MotoGPCard.Collection{MotoGPCard.ICardCollectionPublic}>(/public/motogpCardCollection)
            .check()
    }
`,
	setup_account: `
import MotoGPCard from 0xMOTOGPCARD

// Setup storage for MotoGPCard on signer account
//
transaction {
    prepare(acct: AuthAccount) {
        if acct.borrow<&MotoGPCard.Collection>(from: /storage/motogpCardCollection) == nil {
            let collection <- MotoGPCard.createEmptyCollection() as! @MotoGPCard.Collection
            acct.save(<-collection, to: /storage/motogpCardCollection)
            acct.link<&MotoGPCard.Collection{MotoGPCard.ICardCollectionPublic}>(/public/motogpCardCollection, target: /storage/motogpCardCollection)
        }
    }
}
`,
	transfer: `
import NonFungibleToken from 0xNONFUNGIBLETOKEN
import MotoGPCard from 0xMOTOGPCARD

// transfer MotoGPCard token with tokenId to given address
//
transaction(tokenId: UInt64, to: Address) {
    let token: @NonFungibleToken.NFT
    let receiver: Capability<&MotoGPCard.Collection{MotoGPCard.ICardCollectionPublic}>

    prepare(acct: AuthAccount) {
        let collection = acct.borrow<&MotoGPCard.Collection>(from: /storage/motogpCardCollection)
            ?? panic("Missing NFT collection on signer account")
        self.token <- collection.withdraw(withdrawID: tokenId)
        self.receiver = getAccount(to).getCapability<&MotoGPCard.Collection{MotoGPCard.ICardCollectionPublic}>(/public/motogpCardCollection)
    }

    execute {
        let receiver = self.receiver.borrow()!
        receiver.deposit(token: <- self.token)
    }
}
`,
	burn: `
import MotoGPCard from 0xMOTOGPCARD

// Burn MotoGPCard on signer account by tokenId
//
transaction(tokenId: UInt64) {
    prepare(account: AuthAccount) {
        let collection = account.borrow<&MotoGPCard.Collection>(from: /storage/motogpCardCollection)!
        destroy collection.withdraw(withdrawID: tokenId)
    }
}
`,

}