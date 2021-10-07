import { getAccountAddress, sendTransaction } from "flow-js-testing"
import t from "@onflow/types"
import { sansPrefix } from "@onflow/fcl"
import { createFlowEmulator } from "@rarible/flow-test-common/src"
import { getCollectionConfig } from "../config"
import { replaceImportAddresses } from "../utils/replace-imports"
import { commonNftTransactions } from "../cadence/rarible/scripts"
import { convertRoyalties } from "../cadence/rarible/common-nft"

describe("test transfer", () => {
	const { accountName } = createFlowEmulator({})

	let accountAddress: string
	beforeAll(async () => {
		accountAddress = await getAccountAddress(accountName)
	})
	test("should transfer nft", async () => {
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
		const { id: tokenId } = result.events[1].data
		const transferCode = replaceImportAddresses(commonNftTransactions.transfer, addressMap)
		const transferResult = await sendTransaction({
			code: transferCode,
			args: [[tokenId, t.UInt64], [accountAddress, t.Address]],
		})
		expect(transferResult.events[0].type).toBe(`A.${sansPrefix(accountAddress)}.CommonNFT.Withdraw`)
		expect(transferResult.events[1].type).toBe(`A.${sansPrefix(accountAddress)}.CommonNFT.Deposit`)
		expect(transferResult.events[2].type).toBe(`A.${sansPrefix(accountAddress)}.CommonNFT.Transfer`)
	})
})
