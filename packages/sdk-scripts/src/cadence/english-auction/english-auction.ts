type FlowEnglishAuctionActions = "addLot" | "addBid" | "cancelLot" | "completeLot" | "incrementBid"
export const englishAuctionTxCode: Record<FlowEnglishAuctionActions, string> = {
	addLot: `
	import FungibleToken from address
import NonFungibleToken from address
import EnglishAuction from address
import %ftContract% from address
import %nftContract% from address

// Adds auction lot
//
//   tokenId - id of the token to be auctioned
//   minimumBid - minimum amount of the first bid
//   buyoutPrice - immediate redemption price (e.q. "buy it now")
//   increment - minimum bets step
//   startAt - auction start time (unix time, with fractional)
//   duration - duration of the auction in seconds
//   parts - payouts from seller {recipient:rate (0,1))
//
transaction (
    tokenId: UInt64,
    minimumBid: UFix64,
    buyoutPrice: UFix64?,
    increment: UFix64,
    startAt: UFix64?,
    duration: UFix64,
    parts: {Address:UFix64}
) {
    let item: @NonFungibleToken.NFT
    let reward: Capability<&{FungibleToken.Receiver}>
    let refund: Capability<&{NonFungibleToken.CollectionPublic}>

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

        let collection = account.borrow<&%nftStorageType%>(from: %nftStoragePath%)
                ?? panic("Missing %nftContract% collection on signer account")
        self.item <- collection.withdraw(withdrawID: tokenId)
        self.reward = account.getCapability<&{FungibleToken.Receiver}>(%ftPublicPath%)
        self.refund = account.getCapability<&{NonFungibleToken.CollectionPublic}>(%nftPublicPath%)
    }

    execute {
        let payouts: [EnglishAuction.Payout] = []
        for key in parts.keys {
            let receiver = getAccount(key).getCapability<&{FungibleToken.Receiver}>(%ftPublicPath%)
            payouts.append(EnglishAuction.Payout(target: receiver, rate: parts[key]!))
        }

        EnglishAuction.borrowAuction().addLot(
            reward: self.reward,
            refund: self.refund,
            item: <- self.item,
            bidType: Type<%ftContract%>(),
            minimumBid: minimumBid,
            buyoutPrice: buyoutPrice,
            increment: increment,
            startAt: startAt,
            duration: duration,
            payouts: payouts
        )
    }
}
	`,
	addBid: `
	import FungibleToken from address
import NonFungibleToken from address
import EnglishAuction from address
import %ftContract% from address
import %nftContract% from address

// Adds new auction bid
//
//   lotId - log id
//   amount - bid price
//   parts - payouts for buyer {recipient:rate (0,1))
//
transaction (lotId: UInt64, amount: UFix64, parts: {Address:UFix64}) {
    let vault: @FungibleToken.Vault
    let reward: Capability<&{NonFungibleToken.CollectionPublic}>
    let refund: Capability<&{FungibleToken.Receiver}>

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

        var r: UFix64 = 0.0
        for key in parts.keys { r = r + parts[key]! }
        let mainVault = account.borrow<&FungibleToken.Vault>(from: %ftStoragePath%)
            ?? panic("Cannot borrow %ftContract% vault from account")

        self.vault <- mainVault.withdraw(amount: amount * (1.0+r))
        self.reward = account.getCapability<&{NonFungibleToken.CollectionPublic}>(%nftPublicPath%)
        self.refund = account.getCapability<&{FungibleToken.Receiver}>(%ftPublicPath%)
    }

    execute {
        let payouts: [EnglishAuction.Payout] = []
        for key in parts.keys {
            let receiver = getAccount(key).getCapability<&{FungibleToken.Receiver}>(%ftPublicPath%)
            payouts.append(EnglishAuction.Payout(target: receiver, rate: parts[key]!))
        }

        EnglishAuction.borrowAuction().addBid(
            lotId: lotId,
            reward: self.reward,
            refund: self.refund,
            vault: <- self.vault,
            payouts: payouts
        )
    }
}
	`,
	cancelLot: `
	import EnglishAuction from address

// Cancel lot
//
transaction(lotId: UInt64) {
    let account: AuthAccount

    prepare(account: AuthAccount) {
        self.account = account
    }

    execute {
        EnglishAuction.borrowAuction().cancelLot(auth: self.account, lotId: lotId)
    }
}

	`,
	completeLot: `
	import EnglishAuction from address

// Complete lot
//
transaction (lotId: UInt64) {
    prepare(account: AuthAccount) {
    }

    execute {
        EnglishAuction.borrowAuction().completeLot(lotId: lotId)
    }
}

	`,
	incrementBid: `
	import FungibleToken from address
import EnglishAuction from address
import %ftContract% from address

// Increase primary bid amount
//
//   lotId - log id
//   amount - bid price addition
//
transaction (lotId: UInt64, amount: UFix64) {
    let address: Address
    let vault: @FungibleToken.Vault

    prepare(account: AuthAccount) {
        self.address = account.address
        let mainVault = account.borrow<&FungibleToken.Vault>(from: %ftStoragePath%)
            ?? panic("Cannot borrow %ftContract% vault from account")
        self.vault <- mainVault.withdraw(amount: amount)
    }

    execute {
        EnglishAuction.borrowAuction().increaseBid(
            lotId: lotId,
            address: self.address,
            newVault: <- self.vault,
        )
    }
}
	`,
}
