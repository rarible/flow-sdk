import { createEmulatorAccount, createFlowEmulator, createTestAuth } from "@rarible/flow-test-common"
import fcl from "@onflow/fcl"
import { toBigNumber } from "@rarible/types"
import { createFlowSdk } from "../../index"
import { getTestOrderTmplate } from "../../test/order-template"
import { checkEvent } from "../../test/check-event"
import { getContractAddress } from "../../config/utils"
import { bidTest } from "../test/bid-test"
import { mintTest } from "../test/mint-test"

describe("Bid update", () => {
	createFlowEmulator({})
	const collection = getContractAddress("emulator", "RaribleNFT")
	test("Should update RaribleNFT bid order", async () => {
		const { address, pk } = await createEmulatorAccount("accountName")
		const auth = createTestAuth(fcl, "emulator", address, pk, 0)
		const sdk = createFlowSdk(fcl, "emulator", {}, auth)
		const { address: address1, pk: pk1 } = await createEmulatorAccount("accountName")
		const auth1 = createTestAuth(fcl, "emulator", address1, pk1, 0)
		const sdk1 = createFlowSdk(fcl, "emulator", {}, auth1)

		const mintTx = await mintTest(sdk, collection)
		const tx = await bidTest(sdk, collection, "FLOW", mintTx.tokenId, "0.0001")
		const order = getTestOrderTmplate("bid", tx.orderId, mintTx.tokenId, toBigNumber("0.01"))
		const updateTx = await sdk1.order.bidUpdate(
			collection, "FLOW", order, toBigNumber("0.02"),
		)
		checkEvent(updateTx, "BidAvailable", "RaribleOpenBid")
	})
})
