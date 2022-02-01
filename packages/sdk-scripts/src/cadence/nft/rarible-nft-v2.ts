export const RaribleNFTv2 = {
	mint: `
import NonFungibleToken from address
import SoftCollection from address
import RaribleNFTv2 from address

transaction(minterId: UInt64, receiver: Address, meta: RaribleNFTv2.Meta, royalties: [RaribleNFTv2.Royalty]) {
    let minter: &SoftCollection.Collection

    prepare (account: AuthAccount) {
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
