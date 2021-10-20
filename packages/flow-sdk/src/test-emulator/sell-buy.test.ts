import { getAccountAddress, sendTransaction } from "flow-js-testing"
import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"
import { createFlowEmulator } from "@rarible/flow-test-common/src"
import {
	commonNftTransactions,
	nftStorefrontScripts,
	nftStorefrontTransactions,
} from "@rarible/flow-sdk-scripts/src/cadence/rarible/scripts"
import { convertRoyalties } from "@rarible/flow-sdk-scripts/src/cadence/rarible/common-nft"
import { replaceImportAddresses } from "../common/replace-imports"
import { sansPrefix } from "../common/utils"
import { getCollectionConfig } from "../common/get-collection-config"

describe("test-emulator sell", () => {
	const { accountName } = createFlowEmulator({})

	let accountAddress: string
	beforeAll(async () => {
		accountAddress = await getAccountAddress(accountName)
	})
	test("should place sell order nft", async () => {
		const { addressMap } = getCollectionConfig("emulator", `A.${accountAddress}`)

		//mint nft
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

		// create sell order
		const { id: tokenId } = result.events[1].data
		const sellCode = replaceImportAddresses(nftStorefrontTransactions.sell_item, addressMap)
		const sellResult = await sendTransaction({
			code: sellCode,
			args: [[tokenId, t.UInt64], ["0.001", t.UFix64]],
		})

		const { saleOfferResourceID } = sellResult.events[1].data
		const script = [fcl.script(replaceImportAddresses(nftStorefrontScripts.read_sale_offer_details, addressMap)),
			fcl.args([fcl.arg("0xf8d6e0586b0a20c7", t.Address), fcl.arg(saleOfferResourceID, t.UInt64)])]
		const order = await fcl.send(script)
		const decodedOrder = await fcl.decode(order)
		const { nftID, nftType } = decodedOrder
		expect(nftID).toBe(tokenId)
		expect(nftType).toBe(`A.${sansPrefix(accountAddress)}.CommonNFT.NFT`)

		//buy nft
		const buyCode = replaceImportAddresses(nftStorefrontTransactions.buy_item, addressMap)
		const buyResult = await sendTransaction({
			code: buyCode,
			args: [[saleOfferResourceID, t.UInt64], ["0xf8d6e0586b0a20c7", t.Address]],
		})
		expect(buyResult.events[10].data.id).toBe(tokenId)
	})
})
