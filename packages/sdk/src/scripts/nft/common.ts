export const commonNft = {
	transfer: `
import NonFungibleToken from address
import %nftContract% from address

// transfer %nftContract% token with tokenId to given address
//
transaction(tokenId: UInt64, to: Address) {
    let token: @NonFungibleToken.NFT
    let receiver: Capability<&{%nftPublicTypeMin%}>

    prepare(account: AuthAccount) {
        let collection = account.borrow<&%nftStorageType%>(from: %nftStoragePath%)
            ?? panic("could not borrow %nftContract% collection from account")
        self.token <- collection.withdraw(withdrawID: tokenId)
        self.receiver = getAccount(to).getCapability<&{%nftPublicTypeMin%}>(%nftPublicPath%)
    }

    execute {
        let receiver = self.receiver.borrow()
            ?? panic("recipient %nftContract% collection not initialized")
        receiver.deposit(token: <- self.token)
    }
}

	`,
	burn: `
import NonFungibleToken from address
import %nftContract% from address

// Burn %nftContract% on signer account by tokenId
//
transaction(tokenId: UInt64) {
    prepare(account: AuthAccount) {
        let collection = account.borrow<&%nftStorageType%>(from: %nftStoragePath%)
            ?? panic("could not borrow %nftContract% collection from account")
        destroy collection.withdraw(withdrawID: tokenId)
    }
}

`,
	setupAccount: `
import NonFungibleToken from address
import %nftContract% from address

// Setup storage for %nftContract% on signer account
//
transaction {
    prepare(account: AuthAccount) {
        if !account.getCapability<&{%nftPublicType%}>(%nftPublicPath%).check() {
            if account.borrow<&AnyResource>(from: %nftStoragePath%) != nil {
                account.unlink(%nftPublicPath%)
                account.link<&{%nftPublicType%}>(%nftPublicPath%, target: %nftStoragePath%)
            } else {
                let collection <- %nftContract%.createEmptyCollection() as! @%nftStorageType%
                account.save(<-collection, to: %nftStoragePath%)
                account.link<&{%nftPublicType%}>(%nftPublicPath%, target: %nftStoragePath%)
            }
        }
    }
}

	`,
	check: `
import NonFungibleToken from address
import %nftContract% from address

// check %nftContract% collection is available on given address
access(all)
fun main(address: Address): Bool {
    return getAccount(address)
        .capabilities.get<&{%nftPublicTypeMin%}>(%nftPublicPath%)
        .check()
}
	`,
}

export type Currency = "FLOW" | "FUSD" | "USDC"
