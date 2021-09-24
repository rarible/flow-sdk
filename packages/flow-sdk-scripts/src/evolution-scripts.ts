export const evolutionScripts = {
	borrow: `

import NonFungibleToken from 0xNONFUNGIBLETOKEN
import Evolution from 0xEVOLUTION

pub fun main(address: Address, tokenId: UInt64): &AnyResource {
    let account = getAccount(address)
    let collection = getAccount(address).getCapability<&{Evolution.EvolutionCollectionPublic}>(/public/f4264ac8f3256818_Evolution_Collection).borrow()!
    return collection.borrowNFT(id: tokenId)
}
`, 
	check: `

import NonFungibleToken from 0xNONFUNGIBLETOKEN
import Evolution from 0xEVOLUTION

pub fun main(address: Address): Bool? {
    let account = getAccount(address)
    return getAccount(address).getCapability<&{Evolution.EvolutionCollectionPublic}>(/public/f4264ac8f3256818_Evolution_Collection).check()
}
`, 
	get_ids: `

import NonFungibleToken from 0xNONFUNGIBLETOKEN
import Evolution from 0xEVOLUTION

pub fun main(address: Address): [UInt64]? {
    let account = getAccount(address)
    let collection = getAccount(address).getCapability<&{Evolution.EvolutionCollectionPublic}>(/public/f4264ac8f3256818_Evolution_Collection).borrow()!
    return collection.getIDs()
}
`
}