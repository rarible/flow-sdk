export const motogpCardScripts = {
	borrow_card: `
import NonFungibleToken from 0xNONFUNGIBLETOKEN
import MotoGPCard from 0xMOTOGPCARD

pub fun main(address: Address, tokenId: UInt64): &AnyResource {
    let account = getAccount(address)
    let collection = getAccount(address).getCapability<&{MotoGPCard.ICardCollectionPublic}>(/public/motogpCardCollection).borrow()!
    return collection.borrowNFT(id: tokenId)
}
`,
	get_card_ids: `
import NonFungibleToken from 0xNONFUNGIBLETOKEN
import MotoGPCard from 0xMOTOGPCARD

pub fun main(address: Address): [UInt64]? {
    let account = getAccount(address)
    let collection = getAccount(address).getCapability<&{MotoGPCard.ICardCollectionPublic}>(/public/motogpCardCollection).borrow()!
    return collection.getIDs()
}
`,
}
