export const MotoGPCard = {
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