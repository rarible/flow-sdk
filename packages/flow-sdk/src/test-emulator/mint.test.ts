import { getAccountAddress, sendTransaction } from "flow-js-testing"
import t from "@onflow/types"
import { createFlowEmulator } from "@rarible/flow-test-common/src"
import { commonNftTransactions } from "@rarible/flow-sdk-scripts/src/cadence/rarible/scripts"
import { convertRoyalties } from "@rarible/flow-sdk-scripts/src/cadence/rarible/common-nft"
import { replaceImportAddresses } from "../common/replace-imports"
import { sansPrefix } from "../common/utils"
import { getCollectionConfig } from "../common/get-collection-config"

describe("test-emulator mint", () => {
	const { accountName } = createFlowEmulator({})

	let accountAddress: string
	beforeAll(async () => {
		accountAddress = await getAccountAddress(accountName)
	})
	test("should mint nft", async () => {
		const { addressMap } = getCollectionConfig("emulator", `A.${accountAddress}`)
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