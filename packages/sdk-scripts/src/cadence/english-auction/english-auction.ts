type FlowEnglishAuctionActions = "addLot" | "addBid" | "cancelLot" | "completeLot" | "incrementBid"
export const englishAuctionTxCode: Record<FlowEnglishAuctionActions, string> = {
	addLot: `
import NonFungibleToken from 0xNONFUNGIBLETOKEN
import FungibleToken from 0xFUNGIBLETOKEN
import EnglishAuction from 0xENGLISHAUCTION
import %nftContract% from address
import %ftContract% from address

transaction (
    itemId: UInt64,
    payouts: {Address:UFix64},
    minimumBid: UFix64,
    buyoutPrice: UFix64?,
    increment: UFix64,
    startAt: UFix64?,
    duration: UFix64,
){
    let manager: &EnglishAuction.AuctionManager
    let source: Capability<&{NonFungibleToken.CollectionPublic,NonFungibleToken.Provider}>
    let target: Capability<&{FungibleToken.Receiver}>

    prepare(account: AuthAccount) {
        if account.borrow<&EnglishAuction.AuctionManager>(from: EnglishAuction.AuctionManagerStoragePath) == nil {
            account.save(<-EnglishAuction.createAuctionManager(), to: EnglishAuction.AuctionManagerStoragePath)
        }
        self.manager = account.borrow<&EnglishAuction.AuctionManager>(from: EnglishAuction.AuctionManagerStoragePath)!

        if !account.getCapability<&{%nftPrivateType%}>(%nftPrivatePath%).check() {
            account.link<&{%nftPrivateType%}>(%nftPrivatePath%, target: %nftStoragePath%)
        }

        self.source = account.getCapability<&{%nftPrivateType%}>(%nftPrivatePath%)
        self.target = account.getCapability<&{FungibleToken.Receiver}>(%ftPublicPath%)
    }

    execute {
        let p: [EnglishAuction.Payout] = []
        for address in payouts.keys {
            let target = getAccount(address).getCapability<&{FungibleToken.Receiver}>(%ftPublicPath%)
            p.append(EnglishAuction.Payout(target: target, rate: payouts[address]!))
        }
        self.manager.createLot(
            source: self.source,
            itemId: itemId,
            payouts: p,
            bidType: Type<@FlowToken.Vault>(),
            minimumBid: minimumBid,
            buyoutPrice: buyoutPrice,
            increment: increment,
            startAt: startAt,
            duration: duration,
        )
    }
}
	`,
	addBid: `
import NonFungibleToken from 0xNONFUNGIBLETOKEN
import FungibleToken from 0xFUNGIBLETOKEN
import EnglishAuction from 0xENGLISHAUCTION
import %nftContract% from address

transaction (auctionId: UInt64, price: UFix64, payouts: {Address:UFix64}){
    let manager: &EnglishAuction.AuctionManager
    let reward: Capability<&{NonFungibleToken.CollectionPublic}>
    let source: Capability<&{FungibleToken.Receiver,FungibleToken.Provider}>

    prepare (account: AuthAccount) {
        if account.borrow<&EnglishAuction.AuctionManager>(from: EnglishAuction.AuctionManagerStoragePath) == nil {
            account.save(<-EnglishAuction.createAuctionManager(), to: EnglishAuction.AuctionManagerStoragePath)
        }
        self.manager = account.borrow<&EnglishAuction.AuctionManager>(from: EnglishAuction.AuctionManagerStoragePath)!

        if !account.getCapability<&{%ftPrivateType%}>(%ftPrivatePath%)!.check() {
            account.link<&{%ftPrivateType%}>(%ftPrivatePath%, target: %ftStoragePath%)
        }
        self.source = account.getCapability<&{%ftPrivateType%}>(%ftPrivatePath%)

        if !account.getCapability<&{%nftPublicType%}>(%nftPublicPath%).check() {
            if account.borrow<&AnyResource>(from: %nftStoragePath%) != nil {
                account.unlink(%nftPublicPath%)
                account.link<&{%nftPublicType%}>(%nftPublicPath%, target: %nftStoragePath%)
            } else {
                account.save(<- %nftContract%.createEmptyCollection(), to: %nftStoragePath%)
                account.link<&{%nftPublicType%}>(%nftPublicPath%, target: %nftStoragePath%)
            }
        }
        self.reward = account.getCapability<&{NonFungibleToken.CollectionPublic}>(%nftPublicPath%)
    }

    execute {
        let p: [EnglishAuction.Payout] = []
        for address in payouts.keys {
            let target = getAccount(address).getCapability<&{FungibleToken.Receiver}>(%ftPublicPath%)
            p.append(EnglishAuction.Payout(target: target, rate: payouts[address]!))
        }
        self.manager.createBid(
            auctionId: auctionId,
            reward: self.reward,
            source: self.source,
            price: price,
            payouts: p,
        )
    }
}
	`,
	cancelLot: `
import EnglishAuction from 0xENGLISHAUCTION

// Cancel auction
//
transaction(auctionId: UInt64) {
    let manager: &EnglishAuction.AuctionManager

    prepare(account: AuthAccount) {
        self.manager = account.borrow<&EnglishAuction.AuctionManager>(from: EnglishAuction.AuctionManagerStoragePath)!
    }

    execute {
        self.manager.cancelLot(auctionId: auctionId)
    }
}

	`,
	completeLot: `
import EnglishAuction from 0xENGLISHAUCTION

// Complete lot
//
transaction(auctionId: UInt64) {
    let manager: &EnglishAuction.AuctionManager

    prepare(account: AuthAccount) {
        self.manager = account.borrow<&EnglishAuction.AuctionManager>(from: EnglishAuction.AuctionManagerStoragePath)!
    }

    execute {
        self.manager.completeLot(auctionId: auctionId)
    }
}
	`,
	incrementBid: `
import FungibleToken from 0xFUNGIBLETOKEN
import EnglishAuction from 0xENGLISHAUCTION

transaction (auctionId: UInt64, price: UFix64){
    let manager: &EnglishAuction.AuctionManager
    let vault: @FungibleToken.Vault

    prepare (account: AuthAccount) {
        self.manager = account.borrow<&EnglishAuction.AuctionManager>(from: EnglishAuction.AuctionManagerStoragePath)!
        let main = account.borrow<&FungibleToken.Vault>(from: %ftStoragePath%)!
        self.vault <- main.withdraw(amount: price)
    }

    execute {
        self.manager.increaseBid(auctionId: auctionId, from: <-self.vault)
    }
}
	`,
}
