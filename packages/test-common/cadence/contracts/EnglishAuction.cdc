import FungibleToken from 0xFUNGIBLETOKEN
import NonFungibleToken from 0xNONFUNGIBLETOKEN

pub contract EnglishAuction {

    // LotAvailable
    // A lot has been created and available for bids
    pub event LotAvailable(
        lotId: UInt64,
        seller: Address,
        itemType: String,
        itemId: UInt64,
        bidType: String,
        minimumBid: UFix64,
        buyoutPrice: UFix64?,
        increment: UFix64,
        duration: UFix64,
        startAt: UFix64,
        finishAt: UFix64?
    )

    // LotCompleted
    // The lot has been resolved
    // If the item was sold, then bidder is the address of the winning bid
    // and HammerPrice is the selling price, otherwise both are nil.
    // isCancelled == true when lot was cancelled before auction is finished.
    pub event LotCompleted(
        lotId: UInt64,
        seller: Address,
        bidder: Address?,
        hammerPrice: UFix64?,
        isCancelled: Bool
    )

    // LotEndTimeChanged
    // The lot finishAt was changed due to soft close or buyout
    pub event LotEndTimeChanged(
        lotId: UInt64,
        finishAt: UFix64?
    )

    pub event OpenBid(lotId: UInt64, bidder: Address, amount: UFix64)

    pub event CloseBid(lotId: UInt64, bidder: Address, isWinner: Bool)

    pub event PropertyUpdated(name: String, value: UFix64)

    pub struct Part {
        pub let address: Address
        pub let rate: UFix64

        init(address: Address, rate: UFix64) {
            self.address = address
            self.rate = rate
        }
    }

    // Payout
    // A struct representing the payment to be made by the buyer or seller
    // upon the successful completion of the auction.
    pub struct Payout {
        pub var target: Capability<&{FungibleToken.Receiver}>
        pub var rate: UFix64

        init(
            target: Capability<&{FungibleToken.Receiver}>,
            rate: UFix64
        ) {
            pre {
                0.0 < rate && rate <= 1.0: "AU18: payout: rate must be in range (0,1]"
                target.check(): "AU19: payout: capability not available"
            }
            self.target = target
            self.rate = rate
        }
    }

    pub resource Lot {
        pub let mark: UInt64
        pub var item: @NonFungibleToken.NFT?
        pub let refund: Capability<&{NonFungibleToken.CollectionPublic}>
        pub let payouts: [Payout]

        init(
            mark: UInt64,
            source: Capability<&{NonFungibleToken.CollectionPublic,NonFungibleToken.Provider}>,
            itemId: UInt64,
            payouts: [Payout],
        ) {
            pre {
                source.check() : "AU11: bid: broken item collection capability"
            }
            self.mark = mark
            self.refund = source

            self.item <- source.borrow()!.withdraw(withdrawID: itemId)
            assert(self.item != nil, message: "AU17: not found token in collection")

            var total = UFix64(0)
            for payout in payouts {
                assert(payout.target.check(), message: "AU12: broken payout capability")
                total = total + payout.rate
            }
            assert(total == 1.0, message: "AU28: total payout rate must be equal to 1.0")
            self.payouts = payouts
        }

        pub fun doRefund() {
            let token <- self.item <- nil
            self.refund.borrow()!.deposit(token: <-token!)
        }

        pub fun doReward(receiver: Capability<&{NonFungibleToken.CollectionPublic}>) {
            let token <- self.item <- nil
            receiver.borrow()!.deposit(token: <-token!)
        }

        destroy() {
            assert(self.item == nil, message: "AU35: can't destroy non-empty lot")
            destroy self.item
        }
    }

    pub resource Bid {
        pub let mark: UInt64
        pub let reward: Capability<&{NonFungibleToken.CollectionPublic}>
        pub var vault: @FungibleToken.Vault
        pub var price: UFix64
        pub let refund: Capability<&{FungibleToken.Receiver}>
        pub let payouts: [Payout]

        init(
            mark: UInt64,
            reward: Capability<&{NonFungibleToken.CollectionPublic}>,
            source: Capability<&{FungibleToken.Receiver,FungibleToken.Provider}>,
            price: UFix64,
            payouts: [Payout],
        ) {
            pre {
                source.check(): "AU15: broken token vault"
                reward.check(): "AU14: broken reward capability"
            }

            self.mark = mark
            self.reward = reward
            self.refund = source
            self.price = price

            var amount = price
            for payout in payouts {
                assert(payout.target.check(), message: "AU13: broken payout capability")
                amount = amount + payout.rate * price
            }

            self.payouts = payouts
            self.vault <- source.borrow()!.withdraw(amount: amount)
        }

        pub fun doRefund(bidType: Type): Bool {
            if self.vault == nil { return false }

            if let receiver = self.refund.borrow() {
                if receiver.getType() == bidType {
                    let vault <- self.vault.withdraw(amount: self.vault.balance)
                    receiver.deposit(from: <- vault!)
                    return true
                }
            }
            return false
        }

        pub fun doReward(lotPayouts: [Payout]) {
            var residualReceiver: &{FungibleToken.Receiver}? = nil
            for payout in lotPayouts {
                if let receiver = payout.target.borrow() {
                    receiver.deposit(from: <-self.vault.withdraw(amount: self.price * payout.rate))
                    if (residualReceiver == nil) {
                        residualReceiver = receiver
                    }
                }
            }

            for payout in self.payouts {
                if let receiver = payout.target.borrow() {
                    receiver.deposit(from: <-self.vault.withdraw(amount: self.price * payout.rate))
                }
            }

            assert(residualReceiver != nil, message: "AU16: no valid payment receivers")
            residualReceiver!.deposit(from: <- self.vault.withdraw(amount: self.vault.balance))
        }

        destroy() {
            pre {
                self.vault.balance == 0.0: "AU34: can't destroy non-empty bid"
            }
            destroy self.vault
        }
    }

    pub resource Auction {

        // Auction params
        pub let lot: @Lot
        pub let bidType: Type
        pub let minimumBid: UFix64
        pub let buyoutPrice: UFix64?
        pub let increment: UFix64
        pub let startAt: UFix64
        pub let duration: UFix64

        // State
        pub var bid: @Bid?
        pub var finishAt: UFix64?

        init(
            mark: UInt64,
            lot: @Lot,
            bidType: Type,
            minimumBid: UFix64,
            buyoutPrice: UFix64?,
            increment: UFix64,
            startAt: UFix64?,
            duration: UFix64
        ) {
            pre {
                duration >= EnglishAuction.minimalDuration : "AU27: too short duration"
                duration <= EnglishAuction.maximalDuration : "AU23: too long duration"
                minimumBid >= EnglishAuction.reservePrice : "AU26: too low minimum bid"
                increment >= EnglishAuction.reservePrice : "AU25: too low increment"
                buyoutPrice == nil || buyoutPrice! >= minimumBid : "AU24: too low buyoutPrice"
            }
            self.lot <- lot
            self.bid <- nil
            self.bidType = bidType
            self.minimumBid = minimumBid
            self.buyoutPrice = buyoutPrice
            self.increment = increment
            self.duration = duration

            self.startAt = startAt ?? getCurrentBlock().timestamp
            self.finishAt = startAt == nil ? nil as UFix64? : startAt! + duration
        }

        destroy() {
            destroy self.lot
            destroy self.bid
        }

        pub fun createBid(
            mark: UInt64,
            reward: Capability<&{NonFungibleToken.CollectionPublic}>,
            source: Capability<&{FungibleToken.Receiver,FungibleToken.Provider}>,
            price: UFix64,
            payouts: [Payout],
        ) {
            pre {
                price >= self.minimumBid: "AU21: bid price must be greater than minimumBid"
                price >= (self.bid?.price ?? 0.0) + self.increment: "AU22: bid price must me greater than current bid price + increment"
            }

            let dummy <- self.bid <- nil
            if let beaten <- dummy {
                emit CloseBid(
                    lotId: self.uuid,
                    bidder: beaten.refund.address,
                    isWinner: false,
                )
                if beaten.doRefund(bidType: self.bidType) {
                    destroy beaten
                } else {
                    self.addUnclaimedBid(bid: <-beaten)
                }
            } else {
                destroy dummy
            }

            self.bid <-! create Bid(mark: mark, reward: reward, source: source, price: price, payouts: payouts)

            emit OpenBid(
                lotId: self.uuid,
                bidder: self.owner!.address,
                amount: self.bid?.price!,
            )

            let timestamp = getCurrentBlock().timestamp
            assert(timestamp >= self.startAt, message: "AU38: the auction has not started yet")
            assert(self.finishAt == nil || timestamp < self.finishAt!, message: "AU39: the auction is already finished")

            if self.buyoutPrice != nil && price >= self.buyoutPrice! {
                self.finishAt = timestamp
                emit LotEndTimeChanged(lotId: self.uuid, finishAt: self.finishAt)
                self.complete()
            }

            if self.finishAt == nil {
                self.finishAt = timestamp + self.duration
                emit LotEndTimeChanged(lotId: self.uuid, finishAt: self.finishAt)
            } else {
                if timestamp + EnglishAuction.minimalDuration > self.finishAt! {
                    self.finishAt = timestamp + EnglishAuction.minimalDuration
                    emit LotEndTimeChanged(lotId: self.uuid, finishAt: self.finishAt)
                }
            }
        }

        access(self) fun addUnclaimedBid(bid: @Bid) {
            let mark = bid.mark
            if let bids <- EnglishAuction.unclaimedBids.remove(key: mark) {
                bids.append(<-bid)
                let dummy <- EnglishAuction.unclaimedBids[mark] <- bids
                destroy dummy
            } else {
                let bids: @[EnglishAuction.Bid] <- []
                bids.append(<-bid)
                let dummy <- EnglishAuction.unclaimedBids[mark] <- bids
                destroy dummy
            }
        }

        pub fun complete() {
            pre {
                self.bid != nil: "AU37: no bids"
                self.finishAt ?? 0.0 <= getCurrentBlock().timestamp : "AU30: auction is not over yet"
            }
            let lotRef = &self.lot as &Lot
            self.lot.doReward(receiver: self.bid?.reward!)
            self.bid?.doReward(lotPayouts: self.lot.payouts)

            emit LotCompleted(
                lotId: self.uuid,
                seller: self.lot.refund.address,
                bidder: self.bid?.refund?.address!,
                hammerPrice: self.bid?.price!,
                isCancelled: false,
            )
        }
    }

    pub resource AuctionManager {
        pub fun lotIDs(): [UInt64] { return [] }
        pub fun borrowLot(): &Lot? { return nil }
        pub fun bidIDs(lotId: UInt64): [UInt64] { return [] }
        pub fun borrowBid(lotId: UInt64, bidId: UInt64): &Bid? { return nil }
        pub fun borrow(auctionId: UInt64): &Auction? {
            return &EnglishAuction.auctions[auctionId] as? &Auction
        }

        pub fun createLot(
            source: Capability<&{NonFungibleToken.CollectionPublic,NonFungibleToken.Provider}>,
            itemId: UInt64,
            payouts: [Payout],
            bidType: Type,
            minimumBid: UFix64,
            buyoutPrice: UFix64?,
            increment: UFix64,
            startAt: UFix64?,
            duration: UFix64,
        ): UInt64 {
            let lot <- create Lot(mark: self.uuid, source: source, itemId: itemId, payouts: payouts)
            let itemType = lot.item.getType()
            let auction <- create Auction(
                mark: self.uuid,
                lot: <- lot,
                bidType: bidType,
                minimumBid: minimumBid,
                buyoutPrice: buyoutPrice,
                increment: increment,
                startAt: startAt,
                duration: duration,
            )
            let auctionId = auction.uuid
            emit LotAvailable(
                lotId: auctionId,
                seller: source.address,
                itemType: itemType.identifier,
                itemId: auction.lot.item?.id!,
                bidType: auction.bidType.identifier,
                minimumBid: auction.minimumBid,
                buyoutPrice: auction.buyoutPrice,
                increment: auction.increment,
                duration: auction.duration,
                startAt: auction.startAt,
                finishAt: auction.finishAt,
            )
            EnglishAuction.auctions[auctionId] <-! auction
            return auctionId
        }

        pub fun cancelLot(auctionId: UInt64) {
            let auction <- EnglishAuction.auctions.remove(key: auctionId)!
            assert(auction.lot.mark == self.uuid, message: "AU36: cancellation of the auction is prohibited")
            assert(auction.bid == nil, message: "AU33: can't cancel auction with bids")

            emit LotCompleted(
                lotId: auctionId,
                seller: auction.lot.refund.address,
                bidder: nil,
                hammerPrice: nil,
                isCancelled: true
            )

            auction.lot.doRefund()
            destroy auction
        }

        pub fun createBid(
            auctionId: UInt64,
            reward: Capability<&{NonFungibleToken.CollectionPublic}>,
            source: Capability<&{FungibleToken.Receiver,FungibleToken.Provider}>
            price: UFix64
            payouts: [Payout]
        ) {
            let auction = &EnglishAuction.auctions[auctionId] as? &Auction

            auction.createBid(
                mark: self.uuid,
                reward: reward,
                source: source,
                price: price,
                payouts: payouts,
            )
        }
    }

    pub let ManagerStoragePath: StoragePath
    pub let AdminStoragePath: StoragePath

    pub var minimalDuration: UFix64
    pub var maximalDuration: UFix64
    pub var reservePrice: UFix64

    access(self) let auctions: @{UInt64:Auction}
    access(self) let unclaimedBids: @{UInt64:[Bid]} // todo: add methods for claim bids

    pub fun createAuctionManager(): @AuctionManager {
        return <-create AuctionManager()
    }

    pub fun completeLot(auctionId: UInt64) {
        let auction <- EnglishAuction.auctions.remove(key: auctionId)!

        auction.complete()
        destroy auction
    }

    pub fun borrow(auctionId: UInt64): &Auction? {
        if EnglishAuction.auctions.containsKey(auctionId) {
            return &EnglishAuction.auctions[auctionId] as! &Auction
        } else {
            return nil
        }
    }

    pub fun auctionIDs(): [UInt64] {
        return EnglishAuction.auctions.keys
    }

    pub fun unclaimedBidsIDs(): [UInt64] {
        return EnglishAuction.unclaimedBids.keys
    }

    pub resource Admin {
        pub fun setMinimalDuration(value: UFix64) {
            if (value != EnglishAuction.minimalDuration) {
                emit PropertyUpdated(name: "minimalDuration", value: value)
                EnglishAuction.minimalDuration = value
            }
        }

        pub fun setMaximalDuration(value: UFix64) {
            if (value != EnglishAuction.maximalDuration) {
                emit PropertyUpdated(name: "maximalDuration", value: value)
                EnglishAuction.maximalDuration = value
            }
        }

        pub fun setReservePrice(value: UFix64) {
            if (value != EnglishAuction.reservePrice) {
                emit PropertyUpdated(name: "reservePrice", value: value)
                EnglishAuction.reservePrice = value
            }
        }
    }

    init() {
        self.unclaimedBids <- {}
        self.auctions <- {}
        self.ManagerStoragePath = /storage/AuctionManager
        self.AdminStoragePath = /storage/AuctionAdmin

        // minimal auction duration 15m
        self.minimalDuration = 15.0 * 60.0

        // maximal auction duration 60d
        self.maximalDuration = 60.0 * 24.0 * 60.0 * 60.0

        // a minimum acceptable price established by the seller
        self.reservePrice = 0.00001

        self.account.save(<- create Admin(), to: self.AdminStoragePath)
    }
}
