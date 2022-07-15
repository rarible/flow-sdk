import { FLOW_TESTNET_ACCOUNT_2, FLOW_TESTNET_ACCOUNT_3, FLOW_TESTNET_ACCOUNT_4 } from "@rarible/flow-test-common"
import { toBigNumber, toFlowAddress } from "@rarible/types"
import { toBn } from "@rarible/utils"
import { toFlowContractAddress } from "../../../index"
import { TestnetCollections } from "../../../config/config"
import { createFlowTestTestnetSdk } from "../../helpers/testnet/create-flow-test-testnet-sdk"

describe("Fill tests", () => {
	const testnetCollection = toFlowContractAddress(TestnetCollections.RARIBLE)
	const [{ sdk: testnetSdk }, { sdk: testnetSdk2 }] = createFlowTestTestnetSdk("testnet")

	test("Should fill order on testnet", async () => {
		const testnetCollection = toFlowContractAddress(TestnetCollections.RARIBLE)
		const acc1bal = await testnetSdk.wallet.getFungibleBalance(toFlowAddress(FLOW_TESTNET_ACCOUNT_3.address), "FLOW")
		const mintTx = await testnetSdk.nft.mint(
			testnetCollection,
			"ipfs://ipfs/QmNe7Hd9xiqm1MXPtQQjVtksvWX6ieq9Wr6kgtqFo9D4CU",
			[{ account: toFlowAddress(FLOW_TESTNET_ACCOUNT_3.address), value: toBigNumber("0.1") }],
		)
		expect(
			toBn(await testnetSdk.wallet.getFungibleBalance(toFlowAddress(FLOW_TESTNET_ACCOUNT_3.address), "FLOW")).toNumber(),
		).toBeGreaterThanOrEqual(toBn(acc1bal).minus("0.00001000").toNumber())

		const orderTx = await testnetSdk.order.sell({
			collection: testnetCollection,
			currency: "FLOW",
			itemId: mintTx.tokenId,
			sellItemPrice: "1",
			originFees: [{ account: toFlowAddress(FLOW_TESTNET_ACCOUNT_2.address), value: toBigNumber("0.05") }],
		})
		const buyTx = await testnetSdk2.order.fill(
			testnetCollection,
			"FLOW",
			orderTx.orderId,
			toFlowAddress(FLOW_TESTNET_ACCOUNT_3.address),
			[],
		)

		expect(buyTx.status).toEqual(4)

	}, 1000000)

	test("Should fill RaribleNFT bid order for FLOW tokens on testnet", async () => {
		const acc1bal = await testnetSdk.wallet.getFungibleBalance(toFlowAddress(FLOW_TESTNET_ACCOUNT_3.address), "FLOW")
		const mintTx = await testnetSdk.nft.mint(
			testnetCollection,
			"ipfs://ipfs/QmNe7Hd9xiqm1MXPtQQjVtksvWX6ieq9Wr6kgtqFo9D4CU",
			[{ account: toFlowAddress(FLOW_TESTNET_ACCOUNT_3.address), value: toBigNumber("0.1") }],
		)
		expect(
			toBn(await testnetSdk.wallet.getFungibleBalance(toFlowAddress(FLOW_TESTNET_ACCOUNT_3.address), "FLOW")).toNumber(),
		).toBeGreaterThanOrEqual(toBn(acc1bal).minus("0.00001000").toNumber())
		expect(mintTx.status).toEqual(4)
		const tx = await testnetSdk2.order.bid(
			testnetCollection,
			"FLOW",
			mintTx.tokenId,
			toBigNumber("0.0001"),
			[{ account: toFlowAddress(FLOW_TESTNET_ACCOUNT_2.address), value: toBigNumber("0.1") }],
		)

		const buyTx = await testnetSdk.order.fill(testnetCollection, "FLOW", tx.orderId, FLOW_TESTNET_ACCOUNT_4.address, [{
			account: toFlowAddress(FLOW_TESTNET_ACCOUNT_4.address),
			value: toBigNumber("0.2"),
		}])
		expect(buyTx.status).toEqual(4)
	}, 1000000)
})
