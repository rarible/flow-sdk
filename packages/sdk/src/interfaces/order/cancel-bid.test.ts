import { createFlowEmulator } from "@rarible/flow-test-common"
import { toBigNumber, toFlowAddress } from "@rarible/types"
import { createFlowTestEmulatorSdk } from "../../test/create-flow-test-sdk"
import { checkEvent } from "../../test/check-event"
import { getContractAddress } from "../../config/utils"
import { mintTest } from "../test/mint-test"
import { bidTest } from "../test/bid-test"

describe("Test cancel order on emulator", () => {
	createFlowEmulator({})
	const collection = getContractAddress("emulator", "RaribleNFT")


	test("Should cancel RaribleNFT bid order", async () => {
		const { sdk: sdk1 } = await createFlowTestEmulatorSdk("accountName1")
		const { sdk: sdk2, address: address2 } = await createFlowTestEmulatorSdk("accountName2")
		const mintTx = await mintTest(sdk1, collection)
		const originFees = [{ account: toFlowAddress(address2), value: toBigNumber("0.03") }]
		const tx = await bidTest(sdk2, collection, "FLOW", mintTx.tokenId, "1", originFees)
		expect(tx.status).toEqual(4)

		const cancelBidTx = await sdk2.order.cancelBid(collection, tx.orderId)
		checkEvent(cancelBidTx, "BidCompleted", "RaribleOpenBid")

	})

})
