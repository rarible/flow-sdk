import { toBigNumber } from "@rarible/types"
import { createFlowTestnetSdk } from "../../test/create-flow-test-sdk"
import { createLotEngAucTest } from "../../test/transactions/create-lot-eng-auc-test"
import { getContractAddress } from "../../config/utils"
import { mintRaribleNftTest } from "../../test/transactions/mint-test"
import { retry } from "../../common/retry"

describe("Test English Auction", () => {
	const testnetCollection = getContractAddress("testnet", "RaribleNFT")

	test.skip("test auctions on testnet", async () => {
		const { sdk: testnetSdk, address } = await createFlowTestnetSdk()

		const mint = await mintRaribleNftTest(testnetSdk, testnetCollection)

		const tx = await createLotEngAucTest(
			testnetSdk,
			testnetCollection,
			{
				itemId: mint.tokenId,
				originFees: [{ account: address, value: toBigNumber("0.5") }],
				payouts: [{ account: address, value: toBigNumber("0.03") }],
			},
		)
		const lot = await retry(10, 1000, async () => testnetSdk.apis.auction.getAuctionById({ id: tx.orderId }))
		expect(lot.status).toEqual("ACTIVE")
	}, 60000)
})
