export const raribleFee = {
	getFees: `
	import RaribleFee from "RaribleFee.cdc"

	pub fun main(): {String:UFix64} {
			return {
					"buyerFee": RaribleFee.buyerFee,
					"sellerFee": RaribleFee.sellerFee
			}
	}
	`,
	getFeesAddressByName: `
	import RaribleFee from "RaribleFee.cdc"

pub fun main(name: String): Address {
    return RaribleFee.feeAddressByName(name)
}
	`,
	getFeeAddresses: `
	import RaribleFee from "RaribleFee.cdc"

pub fun main(): {String:Address} {
    return RaribleFee.addressMap()
}`,
}
