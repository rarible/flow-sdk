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
    parts: [EnglishAuction.Part],
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
        if account.borrow<&EnglishAuction.AuctionManager>(from: EnglishAuction.ManagerStoragePath) == nil {
            account.save(<-EnglishAuction.createAuctionManager(), to: EnglishAuction.ManagerStoragePath)
        }
        self.manager = account.borrow<&EnglishAuction.AuctionManager>(from: EnglishAuction.ManagerStoragePath)!

        if !account.getCapability<&{%nftPrivateType%}>(%nftPrivatePath%).check() {
            account.link<&{%nftPrivateType%}>(%nftPrivatePath%, target: %nftStoragePath%)
        }

        self.source = account.getCapability<&{%nftPrivateType%}>(%nftPrivatePath%)
        self.target = account.getCapability<&{FungibleToken.Receiver}>(%ftPublicPath%)
    }

    execute {
        let payouts: [EnglishAuction.Payout] = []
        for part in parts {
            let target = getAccount(part.address).getCapability<&{FungibleToken.Receiver}>(%ftPublicPath%)
            payouts.append(EnglishAuction.Payout(target: target, rate: part.rate))
        }
        self.manager.createLot(
            source: self.source,
            itemId: itemId,
            payouts: payouts,
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

transaction (auctionId: UInt64, price: UFix64, parts: [EnglishAuction.Part]){
    let manager: &EnglishAuction.AuctionManager
    let reward: Capability<&{NonFungibleToken.CollectionPublic}>
    let source: Capability<&{FungibleToken.Receiver,FungibleToken.Provider}>

    prepare (account: AuthAccount) {
        if account.borrow<&EnglishAuction.AuctionManager>(from: EnglishAuction.ManagerStoragePath) == nil {
            account.save(<-EnglishAuction.createAuctionManager(), to: EnglishAuction.ManagerStoragePath)
        }
        self.manager = account.borrow<&EnglishAuction.AuctionManager>(from: EnglishAuction.ManagerStoragePath)!

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
        let payouts: [EnglishAuction.Payout] = []
        for part in parts {
            let target = getAccount(part.address).getCapability<&{FungibleToken.Receiver}>(%ftPublicPath%)
            payouts.append(EnglishAuction.Payout(target: target, rate: part.rate))
        }
        self.manager.createBid(
            auctionId: auctionId,
            reward: self.reward,
            source: self.source,
            price: price,
            payouts: payouts,
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
        self.manager = account.borrow<&EnglishAuction.AuctionManager>(from: EnglishAuction.ManagerStoragePath)!
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
        self.manager = account.borrow<&EnglishAuction.AuctionManager>(from: EnglishAuction.ManagerStoragePath)!
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
        self.manager = account.borrow<&EnglishAuction.AuctionManager>(from: EnglishAuction.ManagerStoragePath)!
        let main = account.borrow<&FungibleToken.Vault>(from: %ftStoragePath%)!
        self.vault <- main.withdraw(amount: price)
    }

    execute {
        self.manager.increaseBid(auctionId: auctionId, from: <-self.vault)
    }
}
	`,
}
