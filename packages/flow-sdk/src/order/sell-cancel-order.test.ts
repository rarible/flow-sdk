import { getAccountAddress, sendTransaction } from "flow-js-testing"
import { createFlowEmulator } from "@rarible/flow-test-common/build"
import { getContractsAddressMap } from "../config"
import { replaceImportAddresses } from "@rarible/flow-sdk-scripts/build/utils/replace-imports"
import {
	commonNftTransactions,
	nftStorefrontScripts,
	nftStorefrontTransactions,
} from "@rarible/flow-sdk-scripts/build/scripts"
import { convertRoyalties } from "@rarible/flow-sdk-scripts/build/common-nft"
import * as fcl from "@onflow/fcl"
import { sansPrefix } from "@onflow/fcl"
import * as t from "@onflow/types"

describe("test sell", () => {
	const { accountName } = createFlowEmulator({})

	let accountAddress: string
	beforeAll(async () => {
		accountAddress = await getAccountAddress(accountName)
	})
	test("should place sell order nft", async () => {
		const addressMap = getContractsAddressMap("emulator", accountAddress)

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
		const cancelCode = replaceImportAddresses(nftStorefrontTransactions.remove_item, addressMap)
		const cancelResult = await sendTransaction({
			code: cancelCode,
			args: [[saleOfferResourceID, t.UInt64]],
		})

		expect(cancelResult.events[0]).toBeTruthy()
	})
})
