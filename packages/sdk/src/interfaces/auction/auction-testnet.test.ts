import { toBigNumber } from "@rarible/types"
import { createFlowTestnetSdk } from "../../test/create-flow-test-sdk"
import { createLotEngAucTest } from "../../test/transactions/create-lot-eng-auc-test"
import { getContractAddress } from "../../config/utils"
import { mintRaribleNftTest } from "../../test/transactions/mint-test"
import { retry } from "../../common/retry"

describe("Test English Auction", () => {
	const testnetCollection = getContractAddress("testnet", "RaribleNFT")

	test.skip("test auctions on testnet", async () => {
		const { sdk, address } = await createFlowTestnetSdk()

		const mint = await mintRaribleNftTest(sdk, testnetCollection)

		const tx = await createLotEngAucTest(
			sdk,
			testnetCollection,
			{
				itemId: mint.tokenId,
				originFees: [{ account: address, value: toBigNumber("0.5") }],
				payouts: [{ account: address, value: toBigNumber("0.03") }],
			},
		)
		const lot = await retry(10, 1000, async () => sdk.apis.auction.getAuctionById({ id: parseInt(tx.lotId) }))
		expect(lot.status).toEqual("ACTIVE")

		const bid1tx = await sdk.auction.createBid({ lotId: tx.lotId, collection: testnetCollection, amount: "0.0002" })
		expect(bid1tx.status).toEqual(4)
		const bid2tx = await sdk.auction.createBid({ lotId: tx.lotId, collection: testnetCollection, amount: "0.0003" })
		expect(bid2tx.status).toEqual(4)

		const bids = await retry(10, 1000, async () => sdk.apis.auction.getAuctionBidsById({ id: parseInt(tx.lotId) }))
		expect(bids.bids.length).toEqual(2)
	}, 600000)
})
