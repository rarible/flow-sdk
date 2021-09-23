import { getAccountAddress, sendTransaction } from "flow-js-testing"
import { createFlowEmulator } from "@rarible/flow-test-common/build"
import t from "@onflow/types"
import { convertRoyalties } from "@rarible/flow-sdk-scripts/build/common-nft"
import { commonNftTransactions } from "@rarible/flow-sdk-scripts/build/scripts"
import { replaceImportAddresses } from "@rarible/flow-sdk-scripts/build/utils/replace-imports"
import { sansPrefix } from "@onflow/fcl"
import { getContractsAddressMap } from "../config"

describe("test transfer", () => {
	const { accountName } = createFlowEmulator({})

	let accountAddress: string
	beforeAll(async () => {
		accountAddress = await getAccountAddress(accountName)
	})
	test("should transfer nft", async () => {
		const addressMap = getContractsAddressMap("emulator", accountAddress)
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
