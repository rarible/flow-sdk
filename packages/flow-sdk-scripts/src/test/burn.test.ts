import { getAccountAddress, sendTransaction } from "flow-js-testing"
import { createFlowEmulator } from "@rarible/flow-test-common/src"
import t from "@onflow/types"
import { sansPrefix } from "@onflow/fcl"
import { getCollectionConfig } from "../config"
import { replaceImportAddresses } from "../utils/replace-imports"
import { commonNftTransactions } from "../cadence/rarible/scripts"
import { convertRoyalties } from "../cadence/rarible/common-nft"

describe("test burn", () => {
	const { accountName } = createFlowEmulator({})

	let accountAddress: string
	beforeAll(async () => {
		accountAddress = await getAccountAddress(accountName)
	})

	test("should burn minted item", async () => {
		const { addressMap } = getCollectionConfig("emulator", `A.${accountAddress}`)
		const code = replaceImportAddresses(
			commonNftTransactions.mint,
			addressMap,
		)
		const RoyaltiesType = t.Array(t.Struct(
			`A.${accountAddress}.CommonNFT.Royalties`,
			[
				{ value: t.Address },
				{ value: t.UFix64 },
			],
		))
		const royalties = convertRoyalties([])
		const result = await sendTransaction({
			code,
			args: [["uri//", t.String], [royalties, RoyaltiesType]],
		})
		expect(result.events[0].type).toBe(`A.${sansPrefix(accountAddress)}.CommonNFT.Mint`)
		expect(result.events[1].type).toBe(`A.${sansPrefix(accountAddress)}.CommonNFT.Deposit`)
		const { id: tokenId, to: recipient } = result.events[1].data
		const burnCode = replaceImportAddresses(commonNftTransactions.burn, addressMap)
		const burnResult = await sendTransaction({
			code: burnCode,
			args: [[tokenId, t.UInt64]],
		})
		expect(burnResult.events[0].type).toBe(`A.${sansPrefix(accountAddress)}.CommonNFT.Withdraw`)
		expect(burnResult.events[1].type).toBe(`A.${sansPrefix(accountAddress)}.CommonNFT.Destroy`)
	})
})
