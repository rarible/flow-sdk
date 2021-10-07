import { extractContractAddress } from "./extract-contract-address"

describe("Test", () => {
	test("should extract contract address from collection string", () => {
		const address = "0x665b9acf64dfdfdb"
		const extracted = extractContractAddress(`A.${address}.CommonNFT.NFT`)
		expect(extracted).toEqual(address)
	})
})
