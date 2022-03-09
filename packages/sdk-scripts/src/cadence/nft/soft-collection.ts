export const SoftCollection = {
	create: `
import NonFungibleToken from 0xNONFUNGIBLETOKEN
import SoftCollection from 0xSOFTCOLLECTION
import RaribleNFTv2 from address

transaction (address: Address, parentId: UInt64?, name: String, symbol: String, icon: String?, description: String?, url: String?, supply: UInt64?, royalties: [SoftCollection.Royalty]) {
    let minter: &{SoftCollection.Minter}
    prepare (account: AuthAccount) {
        if !account.getCapability<&{NonFungibleToken.CollectionPublic}>(SoftCollection.CollectionPublicPath).check() {
            let collection <- SoftCollection.createEmptyCollection() as! @SoftCollection.Collection
            account.save(<- collection, to: SoftCollection.CollectionStoragePath)
            account.link<&{NonFungibleToken.CollectionPublic,NonFungibleToken.Receiver}>(SoftCollection.CollectionPublicPath, target: SoftCollection.CollectionStoragePath)
        }
        if !account.getCapability<&{NonFungibleToken.CollectionPublic}>(RaribleNFTv2.CollectionPublicPath).check() {
            let collection <- RaribleNFTv2.createEmptyCollection() as! @RaribleNFTv2.Collection
            account.save(<- collection, to: RaribleNFTv2.CollectionStoragePath)
            account.link<&{NonFungibleToken.CollectionPublic,NonFungibleToken.Receiver}>(RaribleNFTv2.CollectionPublicPath, target: RaribleNFTv2.CollectionStoragePath)
        }
				self.minter = getAccount(0xSOFTCOLLECTION)
            .getCapability(SoftCollection.MinterPublicPath)
            .borrow<&{SoftCollection.Minter}>()!
    }

    execute {
        self.minter.mint(
            receiver: getAccount(address).getCapability<&{NonFungibleToken.CollectionPublic}>(SoftCollection.CollectionPublicPath),
            parentId: parentId,
            name: name,
            symbol: symbol,
            icon: icon,
            description: description,
            url: url,
            supply: supply,
            royalties: royalties,
        )
    }
}
	`,
	update: `
import NonFungibleToken from 0xNONFUNGIBLETOKEN
import SoftCollection from 0xSOFTCOLLECTION

transaction (id: UInt64, icon: String?, description: String?, url: String?, royalties: [SoftCollection.Royalty]?) {
    let collection: &SoftCollection.Collection

    prepare (account: AuthAccount) {
        self.collection = account.borrow<&SoftCollection.Collection>(from: SoftCollection.CollectionStoragePath)!
    }

    execute {
        self.collection.updateItem(id: id, icon: icon, description: description, url: url, royalties: royalties)
    }
}
`,
}
