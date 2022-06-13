import { toBigNumber, toFlowAddress, toFlowContractAddress } from "@rarible/types"
import { TestnetCollections } from "../../../config/config"
import { createFlowTestTestnetSdk } from "../../helpers/testnet/create-flow-test-testnet-sdk"
import { getTestOrderTmplate } from "../../helpers/order-template"

describe.skip("Test bid on emulator", () => {
	const collection = toFlowContractAddress(TestnetCollections.RARIBLE)
	const [{ sdk: sdk1, address: address1 }, { sdk: sdk2, address: address2 }] = createFlowTestTestnetSdk()

	test("Should create RaribleNFT bid order", async () => {
		// console.log("balance address1", await sdk1.wallet.getFungibleBalance(address1, "FLOW"))
		const mintTx = await sdk1.nft.mint(
			collection,
			"ipfs://ipfs/QmNe7Hd9xiqm1MXPtQQjVtksvWX6ieq9Wr6kgtqFo9D4CU",
			[{ account: toFlowAddress(address2), value: toBigNumber("0.12") }],
		)
		const tx = await sdk2.order.bid(
			collection,
			"FLOW",
			mintTx.tokenId,
			toBigNumber("2"),
			[], //{ account: toFlowAddress(address2), value: toBigNumber("0.03") }
		)
		expect(tx.status).toEqual(4)

		const order = getTestOrderTmplate("bid", tx.orderId, mintTx.tokenId, toBigNumber("1"))
		await sdk1.order.fill(collection, "FLOW", order, address2, [])

		const bid2 = await sdk1.order.bid(collection, "FLOW", mintTx.tokenId, toBigNumber("1"), [])
		const order2 = getTestOrderTmplate("bid", bid2.orderId, mintTx.tokenId, toBigNumber("1"))
		await sdk2.order.fill(collection, "FLOW", order2, address1, [])
	}, 1000000)
})
