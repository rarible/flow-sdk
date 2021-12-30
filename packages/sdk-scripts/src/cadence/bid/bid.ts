export const openBidTransactionCode: Record<"openBid" | "closeBid" | "cancelBid" | "updateBid", string> = {
	openBid: `
		import FungibleToken from address
import NonFungibleToken from address
import RaribleOpenBid from address
import %ftContract% from address
import %nftContract% from address

transaction(nftId: UInt64, price: UFix64, parts: {Address:UFix64}) {
    let openBid: &RaribleOpenBid.OpenBid
    let vault: @FungibleToken.Vault
    let nftReceiver: Capability<&{NonFungibleToken.CollectionPublic}>
    let vaultRef: Capability<&{%ftPrivateType%}>

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

        self.nftReceiver = account.getCapability<&{NonFungibleToken.CollectionPublic}>(%nftPublicPath%)
        assert(self.nftReceiver.check(), message: "Missing or mis-typed %nftContract% receiver")

        if !account.getCapability<&{%ftPrivateType%}>(%ftPrivatePath%)!.check() {
            account.link<&{%ftPrivateType%}>(%ftPrivatePath%, target: %ftStoragePath%)
        }

        self.vaultRef = account.getCapability<&{%ftPrivateType%}>(%ftPrivatePath%)!
        assert(self.vaultRef.check(), message: "Missing or mis-typed fungible token vault ref")

        if account.borrow<&RaribleOpenBid.OpenBid>(from: RaribleOpenBid.OpenBidStoragePath) == nil {
            let openBid <- RaribleOpenBid.createOpenBid()
            account.save(<-openBid, to: RaribleOpenBid.OpenBidStoragePath)
            account.link<&RaribleOpenBid.OpenBid{RaribleOpenBid.OpenBidPublic}>(RaribleOpenBid.OpenBidPublicPath, target: RaribleOpenBid.OpenBidStoragePath)
        }

        self.openBid = account.borrow<&RaribleOpenBid.OpenBid>(from: RaribleOpenBid.OpenBidStoragePath)
            ?? panic("Missing or mis-typed RaribleOpenBid OpenBid")

        var amount = price
        for key in parts.keys {
            amount = amount + parts[key]!
        }

        self.vault <- self.vaultRef.borrow()!.withdraw(amount: amount)
    }

    execute {
        let cuts: [RaribleOpenBid.Cut] = []
        for address in parts.keys {
            cuts.append(
                RaribleOpenBid.Cut(
                    receiver: getAccount(address).getCapability<&{FungibleToken.Receiver}>(%ftPublicPath%),
                    amount: parts[address]!,
                )
            )
        }

        self.openBid.createBid(
            vaultRefCapability: self.vaultRef,
            testVault: <- self.vault,
            rewardCapability: self.nftReceiver,
            nftType: Type<@%nftContract%.NFT>(),
            nftId: nftId,
            cuts: cuts,
        )
    }
}

		`,
	closeBid: `
	import FungibleToken from address
import NonFungibleToken from address
import RaribleOpenBid from address
import %ftContract% from address
import %nftContract% from address

transaction(bidId: UInt64, openBidAddress: Address, parts: {Address:UFix64}) {
    let openBid: &RaribleOpenBid.OpenBid{RaribleOpenBid.OpenBidPublic}
    let bid: &RaribleOpenBid.Bid{RaribleOpenBid.BidPublic}
    let nft: @NonFungibleToken.NFT
    let mainVault: &{FungibleToken.Receiver}

    prepare(account: AuthAccount) {
        self.openBid = getAccount(openBidAddress)
            .getCapability(RaribleOpenBid.OpenBidPublicPath)!
            .borrow<&RaribleOpenBid.OpenBid{RaribleOpenBid.OpenBidPublic}>()
            ?? panic("Could not borrow OpenBid from provided address")

        self.bid = self.openBid.borrowBid(bidId: bidId)
            ?? panic("No Offer with that ID in OpenBid")

        let nftId = self.bid.getDetails().nftId
        let nftCollection = account.borrow<&%nftStorageType%>(from: %nftStoragePath%)
            ?? panic("Cannot borrow NFT collection receiver from account")
        self.nft <- nftCollection.withdraw(withdrawID: nftId)

        self.mainVault = account.borrow<&{FungibleToken.Receiver}>(from: %ftStoragePath%)
            ?? panic("Cannot borrow FlowToken vault from account storage")
    }

    execute {
        let vault <- self.bid.purchase(item: <-self.nft)!
        for address in parts.keys {
            let receiver = getAccount(address).getCapability(%ftPublicPath%).borrow<&{FungibleToken.Receiver}>()!
            let part <- vault.withdraw(amount: parts[address]!)
            receiver.deposit(from: <- part)
        }
        self.mainVault.deposit(from: <-vault)
        self.openBid.cleanup(bidId: bidId)
    }
}
`,
	cancelBid: `
		import RaribleOpenBid from adress

transaction(bidId: UInt64) {
    let openBid: &RaribleOpenBid.OpenBid{RaribleOpenBid.OpenBidManager}

    prepare(acct: AuthAccount) {
        self.openBid = acct.borrow<&RaribleOpenBid.OpenBid{RaribleOpenBid.OpenBidManager}>(from: RaribleOpenBid.OpenBidStoragePath)
            ?? panic("Missing or mis-typed RaribleOpenBid.OpenBid")
    }

    execute {
        self.openBid.removeBid(bidId: bidId)
    }
}`,
	updateBid: `
		import FungibleToken from address
import NonFungibleToken from address
import RaribleOpenBid from address
import %ftContract% from address
import %nftContract% from address

transaction(bidId: UInt64, price: UFix64, parts: {Address:UFix64}) {
    let openBid: &RaribleOpenBid.OpenBid
    let bid: &RaribleOpenBid.Bid{RaribleOpenBid.BidPublic}
    let vault: @FungibleToken.Vault
    let nftReceiver: Capability<&{NonFungibleToken.CollectionPublic}>
    let vaultRef: Capability<&{%ftPrivateType%}>

    prepare(account: AuthAccount) {
        self.openBid = account.borrow<&RaribleOpenBid.OpenBid>(from: RaribleOpenBid.OpenBidStoragePath)
            ?? panic("Missing or mis-typed RaribleOpenBid OpenBid")

        self.bid = self.openBid.borrowBid(bidId: bidId)!

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

        self.nftReceiver = account.getCapability<&{NonFungibleToken.CollectionPublic}>(%nftPublicPath%)
        assert(self.nftReceiver.check(), message: "Missing or mis-typed %nftContract% receiver")

        if !account.getCapability<&{%ftPrivateType%}>(%ftPrivatePath%)!.check() {
            account.link<&{%ftPrivateType%}>(%ftPrivatePath%, target: %ftStoragePath%)
        }

        self.vaultRef = account.getCapability<&{%ftPrivateType%}>(%ftPrivatePath%)!
        assert(self.vaultRef.check(), message: "Missing or mis-typed fungible token vault ref")

        var amount = price
        for key in parts.keys {
            amount = amount + parts[key]!
        }

        self.vault <- self.vaultRef.borrow()!.withdraw(amount: amount)
    }

    execute {
        let details = self.bid.getDetails()
        self.openBid.removeBid(bidId: bidId)

        let cuts: [RaribleOpenBid.Cut] = []
        for address in parts.keys {
            cuts.append(
                RaribleOpenBid.Cut(
                    receiver: getAccount(address).getCapability<&{FungibleToken.Receiver}>(%ftPublicPath%),
                    amount: parts[address]!,
                )
            )
        }

        self.openBid.createBid(
            vaultRefCapability: self.vaultRef,
            testVault: <- self.vault,
            rewardCapability: self.nftReceiver,
            nftType: details.nftType,
            nftId: details.nftId,
            cuts: cuts,
        )
    }
}
		`,
}
