const borrowEvolutionId = `
	import NonFungibleToken from "NonFungibleToken.cdc"
import Evolution from "Evolution.cdc"

pub fun main(address: Address, tokenId: UInt64): &AnyResource {
    let account = getAccount(address)
    let collection = getAccount(address).getCapability<&{Evolution.EvolutionCollectionPublic}>(/public/f4264ac8f3256818_Evolution_Collection).borrow()!
    return collection.borrowNFT(id: tokenId)
}`

const getTopShotSetIds = `
import TopShot from "TopShot.cdc"

// This is the script to get a list of all the moments' ids an account owns
// Just change the argument to \`getAccount\` to whatever account you want
// and as long as they have a published Collection receiver, you can see
// the moments they own.

// Parameters:
//
// account: The Flow Address of the account whose moment data needs to be read

// Returns: [UInt64]
// list of all moments' ids an account owns

pub fun main(account: Address): [UInt64] {

    let acct = getAccount(account)

    let collectionRef = acct.getCapability(/public/MomentCollection)
                            .borrow<&{TopShot.MomentCollectionPublic}>()!

    log(collectionRef.getIDs())

    return collectionRef.getIDs()
}`

const borrowMotoGpCardId = `
import NonFungibleToken from "NonFungibleToken.cdc"
import MotoGPCard from "MotoGPCard.cdc"

pub fun main(address: Address, tokenId: UInt64): &AnyResource {
    let account = getAccount(address)
    let collection = getAccount(address).getCapability<&{MotoGPCard.ICardCollectionPublic}>(/public/motogpCardCollection).borrow()!
    return collection.borrowNFT(id: tokenId)
}
`

const evolution = {
	borrowId: borrowEvolutionId,
}

const topShot = {
	getSetIds: getTopShotSetIds,
}

const motoGp = {
	borrowCardId: borrowMotoGpCardId,
}
export const testScripts = {
	evolution,
	topShot,
	motoGp,
}
