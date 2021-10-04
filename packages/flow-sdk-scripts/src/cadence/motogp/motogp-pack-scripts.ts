export const motogpPackScripts = {
	borrow_pack: `
import NonFungibleToken from 0xNONFUNGIBLETOKEN
import MotoGPPack from 0xMOTOGPPACK

pub fun main(address: Address, tokenId: UInt64): &AnyResource {
    let account = getAccount(address)
    let collection = getAccount(address).getCapability<&{MotoGPPack.IPackCollectionPublic}>(/public/motogpPackCollection).borrow()!
    return collection.borrowNFT(id: tokenId)
}
`,
	get_pack_ids: `
import NonFungibleToken from 0xNONFUNGIBLETOKEN
import MotoGPPack from 0xMOTOGPPACK

pub fun main(address: Address): [UInt64]? {
    let account = getAccount(address)
    let collection = getAccount(address).getCapability<&{MotoGPPack.IPackCollectionPublic}>(/public/motogpPackCollection).borrow()!
    return collection.getIDs()
}
`,
}
