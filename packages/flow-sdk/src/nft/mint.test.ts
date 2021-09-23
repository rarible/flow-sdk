import { getAccountAddress, sendTransaction } from "flow-js-testing"
import { createFlowEmulator } from "@rarible/flow-test-common/build"
import t from "@onflow/types"
import { convertRoyalties } from "@rarible/flow-sdk-scripts/build/common-nft"
import { commonNftTransactions } from "@rarible/flow-sdk-scripts/build/scripts"
import { replaceImportAddresses } from "@rarible/flow-sdk-scripts/build/utils/replace-imports"
import { sansPrefix } from "@onflow/fcl"
import { getContractsAddressMap } from "../config"

describe("test mint", () => {
	const { accountName } = createFlowEmulator({})

	let accountAddress: string
	beforeAll(async () => {
		accountAddress = await getAccountAddress(accountName)
	})
	test("should mint nft", async () => {
		const addressMap = getContractsAddressMap("emulator", accountAddress)
		const code = replaceImportAddresses(
			commonNftTransactions.mint,
			addressMap,
		)
		const RoyaltiesType = t.Array(t.Struct(
			`A.${sansPrefix(accountAddress)}.CommonNFT.Royalties`,
			[
				{ value: t.Address },
				{ value: t.UFix64 },
			],
		))
		const royalties = convertRoyalties([{ account: accountAddress, value: "1.0" }])
		const result = await sendTransaction({
			code,
			args: [["uri//", t.String], [royalties, RoyaltiesType]],
		})

		expect(result.events[0].type).toBe(`A.${sansPrefix(accountAddress)}.CommonNFT.Mint`)
		expect(result.events[1].type).toBe(`A.${sansPrefix(accountAddress)}.CommonNFT.Deposit`)
	})
})
