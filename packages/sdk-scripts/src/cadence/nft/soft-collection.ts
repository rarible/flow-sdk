export const SoftCollection = {
	create: `
import NonFungibleToken from "contracts/core/NonFungibleToken.cdc"
import SoftCollection from "contracts/SoftCollection.cdc"

transaction (address: Address, parentId: UInt64?, name: String, symbol: String, icon: String?, description: String?, url: String?, supply: UInt64?, royalties: {Address:UFix64}) {
    let minter: &{SoftCollection.Minter}

    prepare (account: AuthAccount) {
				if !account.getCapability<&{NonFungibleToken.CollectionPublic,NonFungibleToken.Receiver}>(SoftCollection.CollectionPublicPath).check() {
            if account.borrow<&AnyResource>(from: SoftCollection.CollectionStoragePath) != nil {
                account.unlink(SoftCollection.CollectionPublicPath)
                account.link<&{NonFungibleToken.CollectionPublic,NonFungibleToken.Receiver}>(SoftCollection.CollectionPublicPath, target: SoftCollection.CollectionStoragePath)
            } else {
                let collection <- SoftCollection.createEmptyCollection() as! @SoftCollection.Collection
                account.save(<-collection, to: SoftCollection.CollectionStoragePath)
                account.link<&{NonFungibleToken.CollectionPublic,NonFungibleToken.Receiver}>(SoftCollection.CollectionPublicPath, target: SoftCollection.CollectionStoragePath)
            }
        }
        self.minter = getAccount(0xSOFTCOLLECTION)
            .getCapability(SoftCollection.MinterPublicPath)
            .borrow<&{SoftCollection.Minter}>()!
    }

    execute {
        let r:[SoftCollection.Royalty] = []
        for i in royalties.keys {
            r.append(SoftCollection.Royalty(address: i, fee: royalties[i]!))
        }
        self.minter.mint(
            receiver: getAccount(address).getCapability<&{NonFungibleToken.CollectionPublic}>(SoftCollection.CollectionPublicPath),
            parentId: parentId,
            name: name,
            symbol: symbol,
            icon: icon,
            description: description,
            url: url,
            supply: nil,
            royalties: r,
        )
    }
}

	`,
	update: `
import NonFungibleToken from "contracts/core/NonFungibleToken.cdc"
import SoftCollection from "contracts/SoftCollection.cdc"

transaction (id: UInt64, icon: String?, description: String?, url: String?) {
    let collection: &SoftCollection.Collection

    prepare (account: AuthAccount) {
        self.collection = account.borrow<&SoftCollection.Collection>(from: SoftCollection.CollectionStoragePath)!
    }

    execute {
        self.collection.updateItem(id: id, icon: icon, description: description, url: url)
    }
}
`,
}
