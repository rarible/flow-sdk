export const RaribleNFTv2 = {
	mint: `
import NonFungibleToken from address
import SoftCollection from address
import RaribleNFTv2 from address

transaction(minterId: UInt64, receiver: Address, meta: RaribleNFTv2.Meta, royalties: [RaribleNFTv2.Royalty]) {
    let minter: &SoftCollection.Collection

    prepare (account: AuthAccount) {
				if !account.getCapability<&{NonFungibleToken.CollectionPublic,NonFungibleToken.Receiver}>(RaribleNFTv2.CollectionPublicPath).check() {
            if account.borrow<&AnyResource>(from: RaribleNFTv2.CollectionStoragePath) != nil {
                account.unlink(RaribleNFTv2.CollectionPublicPath)
                account.link<&{NonFungibleToken.CollectionPublic,NonFungibleToken.Receiver}>(RaribleNFTv2.CollectionPublicPath, target: RaribleNFTv2.CollectionStoragePath)
            } else {
                let collection <- RaribleNFTv2.createEmptyCollection() as! @RaribleNFTv2.Collection
                account.save(<-collection, to: RaribleNFTv2.CollectionStoragePath)
                account.link<&{NonFungibleToken.CollectionPublic,NonFungibleToken.Receiver}>(RaribleNFTv2.CollectionPublicPath, target: RaribleNFTv2.CollectionStoragePath)
            }
        }
        self.minter = account.borrow<&SoftCollection.Collection>(from: SoftCollection.CollectionStoragePath)!
    }

    execute {
        self.minter.mint(
            softId: minterId,
            receiver: getAccount(receiver).getCapability<&{NonFungibleToken.CollectionPublic}>(RaribleNFTv2.CollectionPublicPath),
            meta: meta,
            royalties: royalties,
        )
    }
}
`,
}
