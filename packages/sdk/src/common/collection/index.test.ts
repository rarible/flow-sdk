import { toFlowContractAddress } from "../flow-address"
import type { NonFungibleContracts } from "../../types"
import { getCollectionData, isFlowCollection } from "."

describe("collection", () => {
	test("must validate collection address", () => {
		expect(isFlowCollection(toFlowContractAddress("A.0x01658d9b94068f3c.TopShot"))).toEqual(true)
	})

	test("must return valid collection data", () => {
		expect(getCollectionData(toFlowContractAddress("A.0x01658d9b94068f3c.TopShot"))).toStrictEqual({
			name: "TopShot",
			address: "0x01658d9b94068f3c",
		})
	})

	test("must throw error if unknown collection", () => {
		const assertion = () => getCollectionData(toFlowContractAddress("A.0x01658d9b94068f3c.Top1Shot"))
		expect(assertion).toThrow(Error)
	})
	test("should check collection data ", () => {
		collections.forEach(c => {
			const { name } = getCollectionData(toFlowContractAddress(`A.0x01658d9b94068f3c.${c}`))
			expect(name).toEqual(c)
		})
	})

})

const collections: NonFungibleContracts = [
	"RaribleNFT",
	"Evolution",
	"MotoGPCard",
	"TopShot",
	"MugenNFT",
	"CNN_NFT",
	"MatrixWorldFlowFestNFT",
	"MatrixWorldVoucher",
	"DisruptArt",
	"Art",
	"StarlyCard",
	"OneFootballCollectible",
	"ChainmonstersRewards",
	"BarterYardPackNFT",
	"Moments",
	"FanfareNFTContract",
	"Kicks",
	"SomePlaceCollectible",
	"IrNFT",
	"IrVoucher",
	"GeniaceNFT",
	"CryptoPiggo",
	"HWGaragePack",
	"HWGaragePackV2",
	"HWGarageCard",
	"HWGarageCardV2",
	"BBxBarbiePack",
	"BBxBarbieCard",
	"BBxBarbieToken",
]
