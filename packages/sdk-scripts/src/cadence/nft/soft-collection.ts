export const SoftCollection = {
	create: `
import NonFungibleToken from "contracts/core/NonFungibleToken.cdc"
import SoftCollection from "contracts/SoftCollection.cdc"

transaction (address: Address, parentId: UInt64?, name: String, symbol: String, icon: String?, description: String?, url: String?, supply: UInt64?, royalties: [SoftCollection.Royalty]) {
    let minter: &SoftCollection.Minter

		prepare(account: AuthAccount) {
        self.minter = account.borrow<&SoftCollection.Minter>(from: SoftCollection.MinterStoragePath)!
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
            supply: nil,
            royalties: royalties,
        )
    }
}

	`,
}